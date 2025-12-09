// controllers/ExamController.js
import XLSX from "xlsx";
import { db, admin } from "../firebase/firebaseAdmin.js";
import ExamModel from "../models/ExamModel.js";

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
  const questionNo =
    row.question_no ??
    row.questionNo ??
    (row.questionNo ? Number(row.questionNo) : idx + 1);

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
    correctOptionKey: String(
      row.correct_option || row.correctOption || row.correct || ""
    ).toUpperCase(),
  };
}

/**
 * ADMIN: upload excel and create exam + questions
 * Expects: multipart/form-data with file buffer and meta fields:
 *  - title
 *  - code
 *  - timeLimitMinutes
 *  - classId
 *  - batchId
 *  - adminUid (optional)
 */
export async function uploadExamFromExcel(req, res) {
  try {
    // we expect multer already handled file parsing in route (req.file.buffer)
    const fileBuffer =
      req.file && req.file.buffer
        ? req.file.buffer
        : req.body.fileBuffer
        ? Buffer.from(req.body.fileBuffer, "base64")
        : null;

    if (!fileBuffer) {
      return res.status(400).json({ error: "Missing file" });
    }

    const {
      title,
      code,
      description = "",
      timeLimitMinutes = null,
      adminUid = null,
      classId = null,
      batchId = null,
    } = req.body;

    if (!title || !code) {
      return res.status(400).json({ error: "Missing title or code" });
    }

    const rows = parseExcelBuffer(fileBuffer);
    if (!rows.length) {
      return res.status(400).json({ error: "Excel file has no rows" });
    }

    // create exam (now with classId + batchId)
    const examData = {
      code,
      title,
      description,
      timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
      classId: classId ? Number(classId) : null, // you send this from frontend
      batchId: batchId || "ALL", // "ALL" means all batches of this class
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
 * ADMIN: create exam from question bank (random selection)
 * POST /api/admin/exams/create-from-bank
 * Body:
 *  {
 *    title,
 *    code,
 *    classId,
 *    batchId,           // "ALL" or specific batch
 *    timeLimitMinutes,
 *    topics: ["Trigonometry", "Algebra"],
 *    totalQuestions: 20,
 *    adminUid (optional)
 *  }
 */
export async function createExamFromQuestionBank(req, res) {
  try {
    const {
      title,
      code,
      classId,
      batchId = "ALL",
      timeLimitMinutes = null,
      topics = [],
      totalQuestions = 0,
      adminUid = null,
    } = req.body;

    if (!title || !code || !classId) {
      return res
        .status(400)
        .json({ error: "Missing title, code or classId" });
    }

    const classNum = Number(classId);
    const topicsArray = Array.isArray(topics) ? topics : [];

    // 1) Load all questions for this class (and topics if provided)
    let query = db
      .collection("QuestionBank")
      .where("classId", "==", classNum);

    const snap = await query.get();

    if (snap.empty) {
      return res
        .status(400)
        .json({ error: "No questions in question bank for this class" });
    }

    const all = [];
    snap.forEach((doc) => {
      const data = doc.data();
      if (!topicsArray.length || topicsArray.includes(data.topic || "")) {
        all.push({ id: doc.id, ...data });
      }
    });

    if (!all.length) {
      return res
        .status(400)
        .json({ error: "No questions match selected topics" });
    }

    const desiredCount = Number(totalQuestions) || all.length;
    const selected = shuffleArray(all).slice(0, desiredCount);

    // 2) Create exam doc
    const examData = {
      code,
      title,
      description: "",
      timeLimitMinutes: timeLimitMinutes
        ? Number(timeLimitMinutes)
        : null,
      classId: classNum,
      batchId: batchId || "ALL",
      createdBy: adminUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      sourceTopics: topicsArray,
    };

    const examRef = db.collection("exams").doc();
    await examRef.set(examData);

    // 3) Copy questions into exam subcollection
    const batch = db.batch();
    const qColl = examRef.collection("questions");

    selected.forEach((q, index) => {
      const qRef = qColl.doc();
      batch.set(qRef, {
        questionNo: index + 1,
        text: q.text,
        type: q.type,
        options: q.options,
        correctOptionKey: q.correctOptionKey,
        sourceQuestionBankId: q.id,
        topic: q.topic,
      });
    });

    await batch.commit();

    return res.json({
      message: "Exam created from question bank",
      examId: examRef.id,
      questionCount: selected.length,
    });
  } catch (err) {
    console.error("createExamFromQuestionBank:", err);
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

    const questions = await ExamModel.getQuestionsForExam(examId, {
      hideCorrect: true,
      orderByNo: true,
    });

    return res.json({
      examId,
      title: exam.title,
      timeLimitMinutes: exam.timeLimitMinutes || null,
      questions,
    });
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
    if (!studentId) {
      return res.status(400).json({ error: "Missing studentId" });
    }

    const exam = await ExamModel.getExamById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // fetch question IDs to optionally randomize order
    const qSnap = await db
      .collection("exams")
      .doc(examId)
      .collection("questions")
      .orderBy("questionNo")
      .get();

    if (qSnap.empty) {
      return res.status(400).json({ error: "No questions in exam" });
    }

    const qIds = [];
    qSnap.forEach((d) => qIds.push(d.id));

    const randomize = req.query.randomize === "true";
    const questionOrder = randomize ? shuffleArray(qIds) : qIds;

    const attemptId = await ExamModel.createAttempt({
      examId,
      studentId,
      questionOrder,
    });

    return res.json({
      attemptId,
      examId,
      questionOrder,
      timeLimitMinutes: exam.timeLimitMinutes || null,
    });
  } catch (err) {
    console.error("startExam:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * STUDENT: submit answers for attempt
 * Body: { studentId, attemptId, answers: { questionId: 'A', ... } }
 * Enforces time limit: uses exam.timeLimitMinutes and attempt.startedAt.
 * If exceeded, marks timedOut.
 * Returns computed score and per-question result.
 */
export async function submitExam(req, res) {
  try {
    const { examId } = req.params;
    const { studentId, attemptId, answers = {} } = req.body;

    if (!studentId || !attemptId) {
      return res
        .status(400)
        .json({ error: "Missing studentId or attemptId" });
    }

    const exam = await ExamModel.getExamById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const attempt = await ExamModel.getAttempt(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    if (attempt.studentId !== studentId) {
      return res
        .status(403)
        .json({ error: "Attempt does not belong to this student" });
    }

    if (attempt.submittedAt) {
      return res.status(400).json({ error: "Attempt already submitted" });
    }

    // check time limit
    let timedOut = false;
    if (exam.timeLimitMinutes && attempt.startedAt) {
      const startedAt = attempt.startedAt.toDate
        ? attempt.startedAt.toDate()
        : new Date(attempt.startedAt); // safeguard

      const now = new Date();
      const elapsedMs = now - startedAt;
      const allowedMs = Number(exam.timeLimitMinutes) * 60 * 1000;

      if (elapsedMs > allowedMs) {
        timedOut = true;
      }
    }

    // Save answers (merge)
    await ExamModel.saveAttemptAnswers(attemptId, {
      ...attempt.answers,
      ...answers,
    });

    // Compute score using correctOptionKey from questions
    const questionsMap = await ExamModel.getQuestionsMap(examId);
    const perQuestionResult = {};
    let correctCount = 0;
    let total = 0;

    // If there's questionOrder in attempt, iterate that; otherwise iterate keys in questionsMap
    const questionOrder =
      attempt.questionOrder && attempt.questionOrder.length
        ? attempt.questionOrder
        : Object.keys(questionsMap);

    for (const qid of questionOrder) {
      const q = questionsMap[qid];
      if (!q) continue;

      total += 1;
      const correct = (q.correctOptionKey || "")
        .toString()
        .trim()
        .toUpperCase();

      const selected =
        answers[qid] ?? (attempt.answers ? attempt.answers[qid] : null) ?? null;

      const selNorm = selected
        ? selected.toString().trim().toUpperCase()
        : null;

      const isCorrect = selNorm && correct && selNorm === correct;

      perQuestionResult[qid] = { selected: selNorm, correct, isCorrect };

      if (isCorrect) correctCount += 1;
    }

    const score = correctCount; // 1 mark per question

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
    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    return res.json(attempt);
  } catch (err) {
    console.error("getAttemptResult:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * STUDENT: get current exam for a given class + batch
 * Query: ?classId=9&batchId=B1
 * Returns latest created exam that matches (batchId or ALL)
 */
export async function getCurrentExamForClassBatch(req, res) {
  try {
    const { classId, batchId } = req.query;

    if (!classId) {
      return res.status(400).json({ error: "Missing classId" });
    }

    const classNum = Number(classId);

    // find exams for this class
    const snap = await db
      .collection("exams")
      .where("classId", "==", classNum)
      .get();

    if (snap.empty) {
      return res.status(404).json({ error: "No exams for this class" });
    }

    const candidates = [];
    snap.forEach((doc) => {
      const data = doc.data();
      // match batch: either exact batch or ALL (for all batches of class)
      if (!batchId || data.batchId === "ALL" || data.batchId === batchId) {
        candidates.push({ id: doc.id, ...data });
      }
    });

    if (!candidates.length) {
      return res
        .status(404)
        .json({ error: "No exams for this class + batch" });
    }

    // choose latest exam by createdAt
    candidates.sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() || 0;
      const tb = b.createdAt?.toMillis?.() || 0;
      return tb - ta; // newest first
    });

    const exam = candidates[0];

    return res.json({
      examId: exam.id,
      title: exam.title,
      code: exam.code,
      timeLimitMinutes: exam.timeLimitMinutes || null,
      classId: exam.classId,
      batchId: exam.batchId,
    });
  } catch (err) {
    console.error("getCurrentExamForClassBatch:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * STUDENT: get latest attempt for "latest result" card
 * GET /api/student/attempts/latest?studentId=...
 */
export async function getLatestAttemptForStudent(req, res) {
  try {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ error: "Missing studentId" });
    }

    const attempt = await ExamModel.getLatestAttemptForStudent(studentId);
    if (!attempt) {
      // no attempts yet for this student
      return res
        .status(404)
        .json({ error: "No attempts found for this student" });
    }

    // Load exam meta for nicer display
    const exam = await ExamModel.getExamById(attempt.examId);
    const examTitle = exam?.title || null;
    const examCode = exam?.code || null;

    return res.json({
      attemptId: attempt.id,
      examId: attempt.examId,
      examTitle,
      examCode,
      score: attempt.score ?? null,
      totalQuestions: attempt.totalQuestions ?? null,
      correctCount: attempt.correctCount ?? null,
      wrongCount: attempt.wrongCount ?? null,
      timedOut: attempt.timedOut ?? false,
      startedAt: attempt.startedAt ?? null,
      submittedAt: attempt.submittedAt ?? null,
    });
  } catch (err) {
    console.error("getLatestAttemptForStudent:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * ADMIN: list all exams (optionally filter by classId)
 * GET /api/admin/exams?classId=6
 */
export async function listExams(req, res) {
  try {
    const { classId } = req.query;

    let query = db.collection("exams");

    if (classId) {
      query = query.where("classId", "==", Number(classId));
    }

    const snap = await query.get();
    if (snap.empty) {
      return res.json({ exams: [] });
    }

    const exams = [];
    snap.forEach((doc) => {
      const data = doc.data();
      exams.push({
        id: doc.id,
        title: data.title || "",
        code: data.code || "",
        classId: data.classId ?? null,
        batchId: data.batchId ?? "ALL",
        timeLimitMinutes: data.timeLimitMinutes ?? null,
        sourceTopics: data.sourceTopics || [],
        createdAt: data.createdAt || null,
      });
    });

    // sort by createdAt desc (newest first)
    exams.sort((a, b) => {
      const ta =
        a.createdAt && a.createdAt.toMillis
          ? a.createdAt.toMillis()
          : 0;
      const tb =
        b.createdAt && b.createdAt.toMillis
          ? b.createdAt.toMillis()
          : 0;
      return tb - ta;
    });

    return res.json({ exams });
  } catch (err) {
    console.error("listExams:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * ADMIN: list attempts for an exam (optional, for View Attempts page later)
 * GET /api/admin/exams/:examId/attempts
 */
export async function getAttemptsForExam(req, res) {
  try {
    const { examId } = req.params;
    if (!examId) {
      return res.status(400).json({ error: "Missing examId" });
    }

    const snap = await db
      .collection("attempts")
      .where("examId", "==", examId)
      .orderBy("createdAt", "desc")
      .get();

    if (snap.empty) {
      return res.json({ attempts: [] });
    }

    const attempts = [];
    snap.forEach((doc) => {
      const data = doc.data();
      attempts.push({
        id: doc.id,
        studentId: data.studentId,
        score: data.score ?? null,
        totalQuestions: data.totalQuestions ?? null,
        correctCount: data.correctCount ?? null,
        wrongCount: data.wrongCount ?? null,
        timedOut: data.timedOut ?? false,
        startedAt: data.startedAt || null,
        submittedAt: data.submittedAt || null,
      });
    });

    return res.json({ examId, attempts });
  } catch (err) {
    console.error("getAttemptsForExam:", err);
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

const ExamController = {
  uploadExamFromExcel,
  createExamFromQuestionBank,
  getQuestions,
  startExam,
  submitExam,
  getAttemptResult,
  getCurrentExamForClassBatch,
  getLatestAttemptForStudent,
  listExams,
  getAttemptsForExam,
};

export default ExamController;
