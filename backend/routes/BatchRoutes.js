// backend/routes/BatchRoutes.js
import express from "express";
import { BatchController } from "../controllers/BatchController.js";

const router = express.Router();

// general
router.get("/", BatchController.getAll);
router.post("/", BatchController.create);

// class-specific listing
router.get("/class/:classNumber", BatchController.getByClass);

// single
router.get("/:id", BatchController.getById);
router.put("/:id", BatchController.update);
router.delete("/:id", BatchController.delete);

// assign/unassign
router.post("/:id/assign", BatchController.assignStudent);
router.post("/:id/unassign", BatchController.unassignStudent);

export default router;
