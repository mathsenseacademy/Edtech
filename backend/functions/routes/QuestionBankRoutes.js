// backend/functions/routes/QuestionBankRoutes.js
import express from "express";
import { 
  uploadQuestionBankJson, // <--- MAKE SURE THIS IS CORRECT
  getTopicsForClass, 
  getQuestionsForClassTopics 
} from "../controllers/QuestionBankController.js";

const router = express.Router();
router.post("/upload", uploadQuestionBankJson);
router.get("/topics", getTopicsForClass);
router.get("/questions", getQuestionsForClassTopics);

export default router;