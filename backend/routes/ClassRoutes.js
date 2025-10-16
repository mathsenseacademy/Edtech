// backend/routes/ClassRoutes.js
import express from "express";
import { ClassController } from "../controllers/ClassController.js";

const router = express.Router();

// GET all classes
router.get("/", ClassController.getAll);

// POST create a new class
router.post("/", ClassController.create);

// GET by ID
router.get("/:id", ClassController.getById);

// PUT update
router.put("/:id", ClassController.update);

// DELETE class
router.delete("/:id", ClassController.delete);

export default router;
