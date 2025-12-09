// routes/QuestionBankRoutes.js
import express from "express";
import multer from "multer";
import QuestionBankController from "../controllers/QuestionBankController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Upload question bank Excel
router.post(
  "/admin/question-bank/upload",
  upload.single("file"),
  QuestionBankController.uploadQuestionBankFromExcel
);

// Topics for a class
router.get(
  "/admin/question-bank/topics",
  QuestionBankController.getTopicsForClass
);

// Questions for class + topics
router.get(
  "/admin/question-bank/questions",
  QuestionBankController.getQuestionsForClassTopics
);

export default router;
