// =============================================
// BACKEND: Updated StudentRoutes.js
// =============================================

import express from "express";
import { StudentController } from "../controllers/StudentController.js";

const router = express.Router();

// Registration and authentication routes
router.post("/register", StudentController.register);
router.get("/check-registration", StudentController.checkRegistration); // Primary endpoint
router.get("/check-exists", StudentController.checkExists); // Legacy endpoint
router.get("/debug", StudentController.debugStudent); // DEBUG - Remove in production

// Student data routes
router.get("/", StudentController.getAll);
router.get("/verified", StudentController.getVerified);
router.get("/profile/:uid", StudentController.getProfile);
router.get("/:id", StudentController.getById);
router.put("/:id", StudentController.update);


export default router;