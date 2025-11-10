// backend/routes/BatchRoutes.js
import express from "express";
import { BatchController } from "../controllers/BatchController.js";

const router = express.Router();

/* 
  ⚠️ Important ordering note:
  - Routes with dynamic parameters (/:id) must come *after* 
    more specific ones like /class/:classNumber or /:id/students.
  - You already did that correctly.
*/

// ✅ Filter batches by class
router.get("/class/:classNumber", BatchController.getByClass);

// ✅ Assign & unassign individual students
router.post("/:id/assign", BatchController.assignStudent);
router.post("/:id/unassign", BatchController.unassignStudent);

// ✅ Unassign all students (clear entire batch)
router.post("/:id/unassign-batch", BatchController.unassignBatch);

// ✅ Get all students inside a specific batch
router.get("/:id/students", BatchController.getStudentsByBatch);

// ✅ Basic CRUD
router.get("/", BatchController.getAll);
router.post("/", BatchController.create);
router.get("/:id", BatchController.getById);
router.put("/:id", BatchController.update);
router.delete("/:id", BatchController.delete);

export default router;
