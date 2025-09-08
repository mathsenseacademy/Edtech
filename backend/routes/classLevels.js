import express from "express";
import { db } from "../firebase/firebaseConfig.js";

const router = express.Router();

// 1. Add class level
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const now = new Date();

    const levelRef = await db.collection("class_levels").add({
      ...data,
      is_active: data.is_active ?? true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });

    res.status(201).json({ message: "Class level added", id: levelRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Edit class level
router.put("/:id", async (req, res) => {
  try {
    const levelId = req.params.id;
    const data = req.body;

    await db.collection("class_levels").doc(levelId).update({
      ...data,
      updated_at: new Date().toISOString(),
    });

    res.json({ message: "Class level updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Show class level by ID
router.get("/:id", async (req, res) => {
  try {
    const levelDoc = await db.collection("class_levels").doc(req.params.id).get();

    if (!levelDoc.exists) {
      return res.status(404).json({ error: "Class level not found" });
    }

    res.json({ id: levelDoc.id, ...levelDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Show all class levels
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("class_levels").get();
    const levels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Show active class levels
router.get("/status/active", async (req, res) => {
  try {
    const snapshot = await db.collection("class_levels").where("is_active", "==", true).get();
    const levels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
