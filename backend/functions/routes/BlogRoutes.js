// functions/routes/blogRoutes.js
import express from "express";
import { BlogController } from "../controllers/BlogController.js";

const router = express.Router();

// Create
router.post("/", BlogController.create);

// Get all
router.get("/", BlogController.getAll);

// FIX — slug route must be BEFORE :id
router.get("/slug/:slug", BlogController.getBySlug);

// Get single by ID
router.get("/:id", BlogController.getById);

// Update
router.put("/:id", BlogController.update);

// Delete
router.delete("/:id", BlogController.remove);

export default router;
