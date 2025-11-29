// controllers/examController.js
import XLSX from "xlsx";
import { db, admin } from "../firebaseAdmin.js";
import { ExamModel } from "../models/ExamModel.js";

/**
 * Parse excel buffer -> rows (array of objects)
 */
function parseExcelBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return rows;
}

/**
 * Normalize a single row into question object expected by model
 */
function normalizeRowToQuestion(row, idx) {
  const questionNo = row.question_no ?? row.questionNo ?? (row.questionNo ? Number(row.questionNo) : idx + 1);
  return {
    questionNo,
    text: String(row.question_text || row.question || ""),
    type: row.question_type || row.type || "MCQ",
    options: {
      A: String(row.option_a || row.optionA || ""),
      B: String(row.option_b || row.optionB || ""),
      C: String(row.option_c || row.optionC || ""),
      D: String(row.option_d || row.optionD || ""),
    },
    correctOptionKey: String((row.correct_option || row.correctOption || row.correct || "")).toUpperCase(),
  };
}

/**
 * ADMIN: upload excel and create exam + questions
 * Expects: multipart/form-data with file buffer and meta fields: title, code, timeLimitMinutes, adminUid (optional)
 */
export async function uploadExamFromExcel(req, res) {
  try {
    // we expect busboy or multer already handled file parsing in route (or use req.file.buffer)
    // For robustness, support both: req.file.buffer (multer) or raw busboy handling in route.
    const fileBuffer = req.file && req.file.buffer ? req.file.buffer : req.body.fileBuffer ? Buffer.from(req.body.fileBuffer, "base64") : null;
    if (!fileBuffer) return res.status(400).json({ error: "Missing file" });

    const { title, code, description = "", timeLimitMinutes = null, adminUid = null } = req.body;
    if (!title || !code) return res.status(400).json({ error: "Missing title or code" });

    const rows = parseExcelBuffer(fileBuffer);
    if (!rows.length) return res.status(400).json({ error: "Excel file has no rows" });

    // create exam
    const examData = {
      code,
      title,
      description,
      timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
      createdBy: adminUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const examRef = db.collection("exams").doc(); // auto id
    await examRef.set(examData);

    // prepare questions
    const questions = rows.map((r, i) => normalizeRowToQuestion(r, i));
    // batch write under subcollection
    const batch = db.batch();
    const qColl = examRef.collection("questions");
    questions.forEach((q) => {
      const qRef = qColl.doc();
      batch.set(qRef, q);
    });
    await batch.commit();

    return res.json({ message: "Exam uploaded", examId: examRef.id });
  } catch (err) {
    console.error("uploadExamFromExcel:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * STUDENT: get questions (hides correctOptionKey)
 */
export async function getQuestions(req, res) {
  try {
    const { examId } = req.params;
    const exam = await ExamModel.getExamById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const questions = await ExamModel.getQuestionsForExam(examId, { hideCorrect: true, orderByNo: true });
    return res.json({ examId, title: exam.title, timeLimitMinutes: exam.timeLimitMinutes || null, questions });
  } catch (err) {
    console.error("getQuestions:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * STUDENT: start exam -> creates an attempt with startedAt and returns attemptId + questionOrder
 * Query param: ?randomize=true to randomize question order
 */
export async function startExam(req, res) {
  try {
    const { examId } = req.params;
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ error: "Missing studentId" });

    const exam = await ExamModel.getExamById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // fetch question IDs to optionally randomize order
    const qSnap = await db.collection("exams").doc(examId).collection("questions").orderBy("questionNo").get();
    if (qSnap.empty) return res.status(400).json({ error: "No questions in exam" });

    const qIds = [];
    qSnap.forEach((d) => qIds.push(d.id));

    const randomize = req.query.randomize === "true";
    const questionOrder = randomize ? shuffleArray(qIds) : qIds;

    const attemptId = await ExamModel.createAttempt({ examId, studentId, questionOrder });
    return res.json({ attemptId, examId, questionOrder, timeLimitMinutes: exam.timeLimitMinutes || null });
  } catch (err) {
    console.error("startExam:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * STUDENT: submit answers for attempt
 * Body: { studentId, attemptId, answers: { questionId: 'A', ... } }
 * Enforces time limit: uses exam.timeLimitMinutes and attempt.startedAt. If exceeded, marks timedOut.
 * Returns computed score and per-question result.
 */
export async function submitExam(req, res) {
  try {
    const { examId } = req.params;
    const { studentId, attemptId, answers = {} } = req.body;
    if (!studentId || !attemptId) return res.status(400).json({ error: "Missing studentId or attemptId" });

    const exam = await ExamModel.getExamById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const attempt = await ExamModel.getAttempt(attemptId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    if (attempt.studentId !== studentId) return res.status(403).json({ error: "Attempt does not belong to this student" });
    if (attempt.submittedAt) return res.status(400).json({ error: "Attempt already submitted" });

    // check time limit
    let timedOut = false;
    if (exam.timeLimitMinutes && attempt.startedAt) {
      const startedAt = attempt.startedAt.toDate ? attempt.startedAt.toDate() : new Date(attempt.startedAt); // safeguard
      const now = new Date();
      const elapsedMs = now - startedAt;
      const allowedMs = Number(exam.timeLimitMinutes) * 60 * 1000;
      if (elapsedMs > allowedMs) {
        timedOut = true;
      }
    }

    // Save answers (merge)
    await ExamModel.saveAttemptAnswers(attemptId, { ...attempt.answers, ...answers });

    // Compute score using correctOptionKey from questions
    const questionsMap = await ExamModel.getQuestionsMap(examId);
    const perQuestionResult = {};
    let correctCount = 0;
    let total = 0;

    // If there's questionOrder in attempt, iterate that; otherwise iterate keys in questionsMap
    const questionOrder = attempt.questionOrder && attempt.questionOrder.length ? attempt.questionOrder : Object.keys(questionsMap);

    for (const qid of questionOrder) {
      const q = questionsMap[qid];
      if (!q) continue;
      total += 1;
      const correct = (q.correctOptionKey || "").toString().trim().toUpperCase();
      const selected = (answers[qid] ?? (attempt.answers ? attempt.answers[qid] : null)) ?? null;
      const selNorm = selected ? selected.toString().trim().toUpperCase() : null;
      const isCorrect = selNorm && correct && selNorm === correct;
      perQuestionResult[qid] = { selected: selNorm, correct, isCorrect };
      if (isCorrect) correctCount += 1;
    }

    const score = correctCount; // 1 mark per question. Change if you want weighting.

    // If timed out, set timedOut flag and you may choose to alter scoring behavior (here we still score but mark timedOut)
    const resultObj = {
      score,
      totalQuestions: total,
      correctCount,
      wrongCount: total - correctCount,
      perQuestionResult,
      timedOut,
    };

    await ExamModel.finalizeAttempt(attemptId, resultObj);

    return res.json({
      attemptId,
      examId,
      ...resultObj,
    });
  } catch (err) {
    console.error("submitExam:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Get result / attempt details (student or admin)
 */
export async function getAttemptResult(req, res) {
  try {
    const { attemptId } = req.params;
    const attempt = await ExamModel.getAttempt(attemptId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    return res.json(attempt);
  } catch (err) {
    console.error("getAttemptResult:", err);
    return res.status(500).json({ error: err.message });
  }
}

/** Utility: shuffle array (Fisher-Yates) */
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
