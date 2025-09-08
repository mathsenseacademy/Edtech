const express = require("express");
const router = express.Router();
const { authenticate, requireTeacher } = require("../middleware/auth");

// Example teacher-only route
router.get("/data", authenticate, requireTeacher, (req, res) => {
  res.json({ secret: "This is teacher-only data!" });
});

module.exports = router;
