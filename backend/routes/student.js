import express from "express";
import { db } from "../firebase/firebaseConfig.js";

const router = express.Router();

// 1. Get all students
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("students").orderBy("registered_at", "desc").get();
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get verified students
router.get("/verified", async (req, res) => {
  try {
    const snapshot = await db.collection("students").where("is_verified", "==", true).get();
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get student by ID
router.get("/:id", async (req, res) => {
  try {
    const studentDoc = await db.collection("students").doc(req.params.id).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ id: studentDoc.id, ...studentDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update student
router.put("/:id", async (req, res) => {
  try {
    await db.collection("students").doc(req.params.id).update(req.body);
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
why