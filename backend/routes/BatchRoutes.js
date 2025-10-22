// backend/routes/BatchRoutes.js
import express from "express";
import { BatchController } from "../controllers/BatchController.js";

const router = express.Router();

// Basic CRUD
router.get("/", BatchController.getAll);
router.post("/", BatchController.create);
router.get("/:id", BatchController.getById);
router.put("/:id", BatchController.update);
router.delete("/:id", BatchController.delete);

// Class filter
router.get("/class/:classNumber", BatchController.getByClass);

// Student assignments
router.post("/:id/assign", BatchController.assignStudent);
router.post("/:id/unassign", BatchController.unassignStudent);

export default router;
