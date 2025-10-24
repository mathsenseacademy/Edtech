// routes/blogRoutes.js
import express from "express";
import { BlogController } from "../controllers/blogController.js";

const router = express.Router();

router.post("/", BlogController.create);       // Create new blog
router.get("/", BlogController.getAll);        // Get all blogs
router.get("/:id", BlogController.getById);    // Get single blog
router.put("/:id", BlogController.update);     // Update blog
router.delete("/:id", BlogController.remove);  // Delete blog

export default router;
