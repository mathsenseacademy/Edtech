// routes/ExamRoutes.js
import express from "express";
import multer from "multer";
import ExamController from "../controllers/ExamController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * ADMIN routes
 */

// Upload full exam via Excel
router.post(
  "/admin/exams/upload",
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res
          .status(400)
          .json({ error: "Missing file (field name: file)" });
      }
      req.body.fileBuffer = req.file.buffer;
      return await ExamController.uploadExamFromExcel(req, res);
    } catch (err) {
      return next(err);
    }
  }
);

// Create exam from question bank
router.post(
  "/admin/exams/create-from-bank",
  ExamController.createExamFromQuestionBank
);

// 🔹 List exams (optionally ?classId=6)
router.get("/admin/exams", ExamController.listExams);

// 🔹 List attempts for a specific exam (for future attempts page)
router.get("/admin/exams/:examId/attempts", ExamController.getAttemptsForExam);

/**
 * STUDENT / PUBLIC routes
 */

router.get("/exams/:examId/questions", ExamController.getQuestions);
router.post("/exams/:examId/start", ExamController.startExam);
router.post("/exams/:examId/submit", ExamController.submitExam);
router.get("/attempts/:attemptId", ExamController.getAttemptResult);
router.get(
  "/student/exams/current",
  ExamController.getCurrentExamForClassBatch
);
router.get(
  "/student/attempts/latest",
  ExamController.getLatestAttemptForStudent
);

export default router;
