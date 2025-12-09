// controllers/questionBankController.js
import XLSX from "xlsx";
import { db, admin } from "../firebase/firebaseAdmin.js";

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
 * Normalize a single row into question object for question bank
 * Excel expected columns (flexible names):
 *  - question / question_text
 *  - option_a / optionA
 *  - option_b / optionB
 *  - option_c / optionC (optional)
 *  - option_d / optionD (optional)
 *  - correct_option / correctOption / correct  (A/B/C/D)
 *  - type / question_type (default "MCQ")
 */
function normalizeRowToBankQuestion(row) {
  return {
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
 * ADMIN: upload questions excel into question bank
 * multipart/form-data:
 *  - file
 *  - classId
 *  - topic
 *  - adminUid (optional)
 */
export async function uploadQuestionBankFromExcel(req, res) {
  try {
    const fileBuffer =
      req.file && req.file.buffer
        ? req.file.buffer
        : req.body.fileBuffer
        ? Buffer.from(req.body.fileBuffer, "base64")
        : null;

    if (!fileBuffer) return res.status(400).json({ error: "Missing file" });

    const { classId, topic, adminUid = null } = req.body;

    if (!classId || !topic) {
      return res
        .status(400)
        .json({ error: "Missing classId or topic for question bank upload" });
    }

    const rows = parseExcelBuffer(fileBuffer);
    if (!rows.length) {
      return res.status(400).json({ error: "Excel file has no rows" });
    }

    const classNum = Number(classId);

    const batch = db.batch();
    const qColl = db.collection("questionBank");

    rows.forEach((r) => {
      const qData = normalizeRowToBankQuestion(r);
      const docRef = qColl.doc();
      batch.set(docRef, {
        ...qData,
        classId: classNum,
        topic: String(topic),
        createdBy: adminUid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    return res.json({
      message: "Question bank uploaded successfully",
      count: rows.length,
      classId: classNum,
      topic,
    });
  } catch (err) {
    console.error("uploadQuestionBankFromExcel:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * ADMIN: get topics list for a class with counts
 * GET /api/admin/question-bank/topics?classId=9
 */
export async function getTopicsForClass(req, res) {
  try {
    const { classId } = req.query;
    if (!classId) {
      return res.status(400).json({ error: "Missing classId" });
    }

    const classNum = Number(classId);

    const snap = await db
      .collection("questionBank")
      .where("classId", "==", classNum)
      .get();

    if (snap.empty) {
      return res.json({ classId: classNum, topics: [] });
    }

    const topicCounts = {};
    snap.forEach((doc) => {
      const data = doc.data();
      const topic = data.topic || "Untitled";
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const topics = Object.entries(topicCounts).map(([topic, count]) => ({
      topic,
      count,
    }));

    return res.json({ classId: classNum, topics });
  } catch (err) {
    console.error("getTopicsForClass:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * ADMIN: get all questions for class + topic(s)
 * GET /api/admin/question-bank/questions?classId=9&topics=Trigo,Algebra
 */
export async function getQuestionsForClassTopics(req, res) {
  try {
    const { classId, topics } = req.query;
    if (!classId) {
      return res.status(400).json({ error: "Missing classId" });
    }

    const classNum = Number(classId);
    const topicsArray = topics
      ? topics.split(",").map((t) => t.trim())
      : [];

    let query = db
      .collection("questionBank")
      .where("classId", "==", classNum);

    // If topics specified, filter in memory (Firestore can't do IN on large arrays easily)
    const snap = await query.get();

    const questions = [];
    snap.forEach((doc) => {
      const data = doc.data();
      if (
        !topicsArray.length ||
        topicsArray.includes(data.topic || "")
      ) {
        questions.push({ id: doc.id, ...data });
      }
    });

    return res.json({ classId: classNum, questions });
  } catch (err) {
    console.error("getQuestionsForClassTopics:", err);
    return res.status(500).json({ error: err.message });
  }
}

const QuestionBankController = {
  uploadQuestionBankFromExcel,
  getTopicsForClass,
  getQuestionsForClassTopics,
};

export default QuestionBankController;
