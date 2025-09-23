import express from "express";
import { db } from "../firebase/firebaseAdmin.js";

const router = express.Router();

// 1. Add category level
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const now = new Date();

    const categoryRef = await db.collection("category_levels").add({
      ...data,
      is_active: data.is_active ?? true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });

    res.status(201).json({ message: "Category level added", id: categoryRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Edit category level
router.put("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const data = req.body;

    await db.collection("category_levels").doc(categoryId).update({
      ...data,
      updated_at: new Date().toISOString(),
    });

    res.json({ message: "Category level updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Show category level by ID
router.get("/:id", async (req, res) => {
  try {
    const categoryDoc = await db.collection("category_levels").doc(req.params.id).get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Category level not found" });
    }

    res.json({ id: categoryDoc.id, ...categoryDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Show all category levels
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("category_levels").get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Show active category levels
router.get("/status/active", async (req, res) => {
  try {
    const snapshot = await db.collection("category_levels").where("is_active", "==", true).get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
