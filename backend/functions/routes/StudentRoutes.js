import express from "express";
import { StudentController } from "../controllers/StudentController.js";

const router = express.Router();

// Register a new student
router.post("/register", StudentController.register);

// Check if a student is already registered
router.get("/check-registration", StudentController.checkRegistration);

// Get all students
router.get("/", StudentController.getAll);

// Get verified students
router.get("/verified", StudentController.getVerified);

// Get student profile by UID
router.get("/profile/:uid", StudentController.getProfile);

// Get students by class number (NEW)
router.get("/class/:classNumber", StudentController.getByClass);

// Get student by database ID
router.get("/:id", StudentController.getById);

// Update student details
router.put("/:id", StudentController.update);

// Toggle student fee status
router.put("/:uid/fees", StudentController.toggleFees);

// Reset monthly fees for all students
router.post("/reset-fees", StudentController.resetMonthlyFees);

export default router;
