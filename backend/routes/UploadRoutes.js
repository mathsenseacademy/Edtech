import express from "express";
import multer from "multer";
import { imagekit } from "../utils/imagekit.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload Image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { buffer, originalname } = req.file;

    const uploadResponse = await imagekit.upload({
      file: buffer.toString("base64"),
      fileName: originalname,
      folder: "students", 
    });

    res.json({ url: uploadResponse.url });
  } catch (error) {
    console.error("❌ Image upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
