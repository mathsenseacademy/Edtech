// models/examModel.js
import { db, admin } from "../firebase/firebaseAdmin.js";

/**
 * Firestore structure assumed:
 * - exams/{examId}
 * - exams/{examId}/questions/{questionId}
 * - attempts/{attemptId}
 */

const examsCol = () => db.collection("exams");
const attemptsCol = () => db.collection("attempts");

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function createExam(examId, examData) {
  const ref = examsCol().doc(examId || undefined);
  await ref.set({
    ...examData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function getExamById(examId) {
  const doc = await examsCol().doc(examId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

/**
 * Add potentially large arrays of questions to exam subcollection.
 * Uses chunked batches to avoid Firestore 500 write limit.
 * questionsArray: array of plain question objects
 */
export async function addQuestionsToExam(examId, questionsArray) {
  if (!Array.isArray(questionsArray) || !questionsArray.length) return true;

  const qColl = examsCol().doc(examId).collection("questions");
  // safe batch size: keep under 500 (use 450)
  const chunks = chunkArray(questionsArray, 450);

  for (const chunk of chunks) {
    const batch = db.batch();
    chunk.forEach((q) => {
      const qRef = qColl.doc();
      batch.set(qRef, q);
    });
    await batch.commit();
  }

  return true;
}

/**
 * Get questions for an exam
 * - hideCorrect: if true, remove correctOptionKey
 * - orderByNo: if true, order by questionNo
 */
export async function getQuestionsForExam(
  examId,
  { hideCorrect = true, orderByNo = true } = {}
) {
  const qRef = examsCol().doc(examId).collection("questions");
  const snapshot = orderByNo
    ? await qRef.orderBy("questionNo").get()
    : await qRef.get();

  if (snapshot.empty) return [];

  const list = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (hideCorrect) {
      const { correctOptionKey, ...rest } = data;
      list.push({ questionId: doc.id, ...rest });
    } else {
      list.push({ questionId: doc.id, ...data });
    }
  });
  return list;
}

/**
 * Returns map: questionId -> questionData (including correctOptionKey)
 */
export async function getQuestionsMap(examId) {
  const qSnap = await examsCol().doc(examId).collection("questions").get();
  const map = {};
  qSnap.forEach((doc) => {
    map[doc.id] = doc.data();
  });
  return map;
}

/**
 * Create an attempt document
 */
export async function createAttempt({ examId, studentId, questionOrder = null }) {
  const attemptRef = attemptsCol().doc();
  const attemptObj = {
    examId,
    studentId,
    answers: {}, // questionId -> selected option
    startedAt: admin.firestore.FieldValue.serverTimestamp(),
    submittedAt: null,
    score: null,
    totalQuestions: null,
    timedOut: false,
    questionOrder: questionOrder || null, // array of questionIds (optional randomization)
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await attemptRef.set(attemptObj);
  return attemptRef.id;
}

export async function getAttempt(attemptId) {
  const doc = await attemptsCol().doc(attemptId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

/**
 * Merge / overwrite answers for an attempt
 */
export async function saveAttemptAnswers(attemptId, answersObj) {
  const attemptRef = attemptsCol().doc(attemptId);
  await attemptRef.set(
    {
      answers: answersObj,
    },
    { merge: true }
  );
  return true;
}

/**
 * Finalize an attempt with score + result details
 * resultObj: { score, totalQuestions, correctCount, wrongCount, perQuestionResult, timedOut? }
 *
 * Uses update() normally, but falls back to set(..., { merge: true }) if update fails
 * because the attempt doc doesn't exist (defensive).
 */
export async function finalizeAttempt(attemptId, resultObj) {
  const attemptRef = attemptsCol().doc(attemptId);
  try {
    await attemptRef.update({
      ...resultObj,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    // if the document does not exist, use merge set as a fallback
    if (err.code === 5 || /not-found/i.test(err.message)) {
      await attemptRef.set(
        {
          ...resultObj,
          submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      throw err;
    }
  }
  return true;
}

/**
 * Fetch student's latest attempt for a specific exam (optional helper)
 */
export async function getStudentAttemptForExam(studentId, examId) {
  const snap = await attemptsCol()
    .where("studentId", "==", studentId)
    .where("examId", "==", examId)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Fetch student's latest attempt across all exams
 * Used for "Your latest exam result" card
 */
export async function getLatestAttemptForStudent(studentId) {
  if (!studentId) return null;

  const snap = await attemptsCol()
    .where("studentId", "==", studentId)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

export default {
  createExam,
  getExamById,
  addQuestionsToExam,
  getQuestionsForExam,
  getQuestionsMap,
  createAttempt,
  getAttempt,
  saveAttemptAnswers,
  finalizeAttempt,
  getStudentAttemptForExam,
  getLatestAttemptForStudent,
};
