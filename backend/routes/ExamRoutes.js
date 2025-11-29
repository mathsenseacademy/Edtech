// routes/examRoutes.js
import express from "express";
import multer from "multer";
import { ExamController } from "../controllers/ExamController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

/**
 * ADMIN routes
 * - POST /api/admin/exams/upload  (multipart/form-data file + title + code + timeLimitMinutes)
 *
 * NOTE: Protect these routes with auth & admin-check middleware in your main app.
 */
router.post("/admin/exams/upload", upload.single("file"), async (req, res, next) => {
  try {
    // the controller expects req.file.buffer to exist
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: "Missing file (field name: file)" });
    // attach buffer to req.body for controller convenience
    req.body.fileBuffer = req.file.buffer;
    return await ExamController.uploadExamFromExcel(req, res);
  } catch (err) {
    return next(err);
  }
});

/**
 * PUBLIC / STUDENT routes
 */

// get questions for exam (hides correct answers)
router.get("/exams/:examId/questions", ExamController.getQuestions);

// start exam (creates attempt with startedAt)
router.post("/exams/:examId/start", ExamController.startExam);

// submit answers (submit attempt; checks time limit)
router.post("/exams/:examId/submit", ExamController.submitExam);

// get attempt/result
router.get("/attempts/:attemptId", ExamController.getAttemptResult);

export default router;
