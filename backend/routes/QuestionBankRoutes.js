import express from "express";
// Import the SPECIFIC function names
import { 
  uploadQuestionBankJson, 
  getTopicsForClass, 
  getQuestionsForClassTopics 
} from "../controllers/QuestionBankController.js";

const router = express.Router();

// POST /api/admin/question-bank/upload
router.post("/upload", uploadQuestionBankJson);

// GET topics / questions
router.get("/topics", getTopicsForClass);
router.get("/questions", getQuestionsForClassTopics);

export default router;