import express from "express";
import { db } from "../firebase/firebaseAdmin.js";

const router = express.Router();

// 1. Add curriculum
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const now = new Date();

    const curriculumRef = await db.collection("curriculums").add({
      ...data,
      is_active: data.is_active ?? true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });

    res.status(201).json({ message: "Curriculum added", id: curriculumRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Edit curriculum
router.put("/:id", async (req, res) => {
  try {
    const curriculumId = req.params.id;
    const data = req.body;

    await db.collection("curriculums").doc(curriculumId).update({
      ...data,
      updated_at: new Date().toISOString(),
    });

    res.json({ message: "Curriculum updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Show curriculum by ID
router.get("/:id", async (req, res) => {
  try {
    const curriculumDoc = await db.collection("curriculums").doc(req.params.id).get();

    if (!curriculumDoc.exists) {
      return res.status(404).json({ error: "Curriculum not found" });
    }

    res.json({ id: curriculumDoc.id, ...curriculumDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Show all curriculums
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("curriculums").get();
    const curriculums = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(curriculums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Show active curriculums
router.get("/status/active", async (req, res) => {
  try {
    const snapshot = await db.collection("curriculums").where("is_active", "==", true).get();
    const curriculums = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(curriculums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Show active curriculums by course ID
router.get("/course/:courseId/active", async (req, res) => {
  try {
    const { courseId } = req.params;
    const snapshot = await db.collection("curriculums")
      .where("course_id", "==", courseId)
      .where("is_active", "==", true)
      .get();

    const curriculums = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(curriculums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
