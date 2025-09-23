import express from "express";
import { db } from "../firebase/firebaseAdmin.js";

const router = express.Router();

// 1. Add classroom essential
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const now = new Date();

    const essentialRef = await db.collection("classroom_essentials").add({
      ...data,
      is_active: data.is_active ?? true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });

    res.status(201).json({ message: "Classroom essential added", id: essentialRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Edit classroom essential
router.put("/:id", async (req, res) => {
  try {
    const essentialId = req.params.id;
    const data = req.body;

    await db.collection("classroom_essentials").doc(essentialId).update({
      ...data,
      updated_at: new Date().toISOString(),
    });

    res.json({ message: "Classroom essential updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Show classroom essential by ID
router.get("/:id", async (req, res) => {
  try {
    const essentialDoc = await db.collection("classroom_essentials").doc(req.params.id).get();

    if (!essentialDoc.exists) {
      return res.status(404).json({ error: "Classroom essential not found" });
    }

    res.json({ id: essentialDoc.id, ...essentialDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Show all classroom essentials
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("classroom_essentials").get();
    const essentials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(essentials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Show active classroom essentials
router.get("/status/active", async (req, res) => {
  try {
    const snapshot = await db.collection("classroom_essentials").where("is_active", "==", true).get();
    const essentials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(essentials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Show active classroom essentials by course ID
router.get("/course/:courseId/active", async (req, res) => {
  try {
    const { courseId } = req.params;
    const snapshot = await db.collection("classroom_essentials")
      .where("course_id", "==", courseId)
      .where("is_active", "==", true)
      .get();

    const essentials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(essentials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
