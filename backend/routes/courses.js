import express from "express";
import { db } from "../firebase/firebaseAdmin.js";

const router = express.Router();

// 1. Create a new course
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const now = new Date();

    const courseRef = await db.collection("courses").add({
      ...data,
      is_active: data.is_active ?? true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });

    res.status(201).json({ message: "Course created", id: courseRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Edit a course
router.put("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const data = req.body;

    await db.collection("courses").doc(courseId).update({
      ...data,
      updated_at: new Date().toISOString(),
    });

    res.json({ message: "Course updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Show course by ID
router.get("/:id", async (req, res) => {
  try {
    const courseDoc = await db.collection("courses").doc(req.params.id).get();

    if (!courseDoc.exists) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ id: courseDoc.id, ...courseDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Show all courses
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("courses").get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Show all active courses
router.get("/status/active", async (req, res) => {
  try {
    const snapshot = await db.collection("courses").where("is_active", "==", true).get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Public: Show all courses
router.get("/public/all", async (req, res) => {
  try {
    const snapshot = await db.collection("courses").get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Public: Course details
router.get("/public/:id", async (req, res) => {
  try {
    const courseDoc = await db.collection("courses").doc(req.params.id).get();

    if (!courseDoc.exists) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ id: courseDoc.id, ...courseDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
