import express from "express";
import { db, auth } from "../firebase/firebaseConfig.js";

const router = express.Router();

// Register a student
router.post("/register", async (req, res) => {
  try {
    const { email, password, first_name, last_name, ...rest } = req.body;

    // 1. Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // 2. Generate custom student_id
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const student_id = `MSA_${month}${year}_${userRecord.uid.substring(0,5)}`;

    // 3. Save profile in Firestore
    await db.collection("students").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      first_name,
      last_name,
      student_id,
      registered_at: now.toISOString(),
      ...rest
    });

    res.status(201).json({ message: "Student registered", student_id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
