const express = require("express");
const router = express.Router();
const { admin, db } = require("../firebaseAdmin");
const { authenticate } = require("../middleware/auth");

// Only allow YOU (admin) to assign teacher role
router.post("/make-teacher", authenticate, async (req, res) => {
  if (req.user.uid !== process.env.MY_ADMIN_UID) {
    return res.status(403).send("Not allowed");
  }

  const { uid } = req.body;
  if (!uid) return res.status(400).send("UID required");

  try {
    // Set custom claim
    await admin.auth().setCustomUserClaims(uid, { role: "teacher" });

    // Update Firestore doc too
    await db.doc(`users/${uid}`).set({ role: "teacher" }, { merge: true });

    res.send({ ok: true, message: "Teacher role assigned. User must re-login." });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = router;
