import { db, admin } from "../firebase/firebaseAdmin.js";

const QUESTION_BANK_COLLECTION = "questionBank";
const FIRESTORE_BATCH_SAFE_SIZE = 450;

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function normalizeRowToBankQuestion(row) {
  return {
    text: String(row.question_text || row.question || "").trim(),
    type: row.question_type || row.type || "MCQ",
    options: {
      A: String(row.option_a || row.optionA || "").trim(),
      B: String(row.option_b || row.optionB || "").trim(),
      C: String(row.option_c || row.optionC || "").trim(),
      D: String(row.option_d || row.optionD || "").trim(),
    },
    correctOptionKey: String(row.correct_option || row.correctOption || row.correct || "")
      .toString().trim().toUpperCase(),
  };
}

// --- NEW FUNCTION: Handles JSON rows directly ---
export async function uploadQuestionBankJson(req, res) {
  try {
    console.log("=== uploadQuestionBankJson: START ===");
    
    // 1. EXTRACT DATA DIRECTLY FROM BODY
    const { classId, topic, rows, adminUid } = req.body;

    // 2. VALIDATION
    if (!classId || !topic) {
      console.error("Missing classId or topic");
      return res.status(400).json({ error: "Missing classId or topic" });
    }

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      console.error("No rows found in request body");
      return res.status(400).json({ error: "No question data received (rows is empty)." });
    }

    const classNum = Number(classId);

    // 3. SAVE TO FIRESTORE
    const chunks = chunkArray(rows, FIRESTORE_BATCH_SAFE_SIZE);
    let total = 0;

    for (const chunk of chunks) {
      const batch = db.batch();
      chunk.forEach((r) => {
        const qData = normalizeRowToBankQuestion(r);
        const docRef = db.collection(QUESTION_BANK_COLLECTION).doc();
        batch.set(docRef, {
          ...qData,
          classId: classNum,
          topic: String(topic).trim(),
          createdBy: adminUid || "admin",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
      total += chunk.length;
      console.log(`Saved batch of ${chunk.length}`);
    }

    console.log("=== uploadQuestionBankJson: SUCCESS ===");
    return res.json({
      message: "Upload successful",
      count: total,
      classId: classNum,
      topic
    });

  } catch (err) {
    console.error("Controller Error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

// --- GET FUNCTIONS ---
export async function getTopicsForClass(req, res) {
  try {
    const { classId } = req.query;
    if (!classId) return res.status(400).json({ error: "Missing classId" });
    const classNum = Number(classId);
    
    const snap = await db.collection(QUESTION_BANK_COLLECTION).where("classId", "==", classNum).get();
    if (snap.empty) return res.json({ classId: classNum, topics: [] });

    const topicCounts = Object.create(null);
    snap.forEach((doc) => {
      const data = doc.data();
      const topicName = (data.topic || "Untitled").toString().trim();
      topicCounts[topicName] = (topicCounts[topicName] || 0) + 1;
    });

    const topics = Object.entries(topicCounts).map(([topic, count]) => ({ topic, count }));
    topics.sort((a, b) => (b.count !== a.count ? b.count - a.count : a.topic.localeCompare(b.topic)));

    return res.json({ classId: classNum, topics });
  } catch (err) {
    console.error("getTopicsForClass:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getQuestionsForClassTopics(req, res) {
  try {
    const { classId, topics } = req.query;
    if (!classId) return res.status(400).json({ error: "Missing classId" });
    const classNum = Number(classId);
    const topicsArray = topics ? topics.split(",").map((t) => t.trim()).filter(Boolean) : [];

    const snap = await db.collection(QUESTION_BANK_COLLECTION).where("classId", "==", classNum).get();
    const questions = [];
    snap.forEach((doc) => {
      const data = doc.data();
      const docTopic = (data.topic || "").toString().trim();
      if (!topicsArray.length || topicsArray.includes(docTopic)) {
        questions.push({ id: doc.id, ...data });
      }
    });

    return res.json({ classId: classNum, questions });
  } catch (err) {
    console.error("getQuestionsForClassTopics:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}