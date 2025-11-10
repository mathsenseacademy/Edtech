import express from "express";
import { ClassController } from "../controllers/ClassController.js";

const router = express.Router();

// Get all classes
router.get("/", ClassController.getAll);

// Create a new class
router.post("/", ClassController.create);

// Get class by ID
router.get("/:id", ClassController.getById);

// Update class by ID
router.put("/:id", ClassController.update);

router.delete("/:id", ClassController.delete);

export default router;
