// =============================================
// BACKEND: Final StudentRoutes.js
// =============================================

import express from "express";
import { StudentController } from "../controllers/StudentController.js";

const router = express.Router();

// =============================================
// Registration and verification routes
// =============================================
router.post("/register", StudentController.register);
router.get("/check-registration", StudentController.checkRegistration); // Modern endpoint
router.get("/check-exists", StudentController.checkExists); // Legacy support

// =============================================
// Student data routes
// =============================================
router.get("/", StudentController.getAll);
router.get("/verified", StudentController.getVerified);
router.get("/profile/:uid", StudentController.getProfile);
router.get("/:id", StudentController.getById);
router.put("/:id", StudentController.update);

// =============================================
// Admin & Fees Management
// =============================================
router.put("/:uid/fees", StudentController.toggleFees); // Mark fees Yes/No
router.post("/reset-fees", StudentController.resetMonthlyFees); // Monthly reset (cron or manual)

// =============================================
// Export router
// =============================================
export default router;
