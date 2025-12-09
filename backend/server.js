import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { StudentModel } from "./models/StudentModel.js";

// Load env variables
dotenv.config();

// Import Firebase DB and Routes
import { db } from "./firebase/firebaseAdmin.js";
import studentRoutes from "./routes/StudentRoutes.js";
import classRoutes from "./routes/ClassRoutes.js";
import batchRoutes from "./routes/BatchRoutes.js";
import BlogRoutes from "./routes/BlogRoutes.js";
import ExamRoutes from "./routes/ExamRoutes.js";
import QuestionBankRoutes from "./routes/QuestionBankRoutes.js";

const app = express();

/* -----------------------------------------
 ✅ CRON JOB – Monthly Reset Example
----------------------------------------- */
cron.schedule(
  "1 0 1 * *",
  async () => {
    console.log("🔄 Running automatic monthly fees reset...");
    try {
      await StudentModel.resetAllFees();
      console.log("✅ All students' fees reset to 'No'");
    } catch (err) {
      console.error("❌ Monthly fees reset failed:", err);
    }
  },
  { timezone: "Asia/Kolkata" }
);

/* -----------------------------------------
 ✅ MIDDLEWARE
----------------------------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "www.mathsenseacademy.com",
      "https://mathsenseacademy-55f13.web.app",
      "https://mathsenseacademy-55f13.firebaseapp.com",
      "https://mathsenseacademy.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.query);
  next();
});

/* -----------------------------------------
 ✅ HEALTH CHECK ROUTE
----------------------------------------- */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* -----------------------------------------
 ✅ TEST ROUTE
----------------------------------------- */
app.get("/test", async (req, res) => {
  try {
    const snapshot = await db.collection("students").limit(5).get();
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      google_uid: doc.data().google_uid ? "***hidden***" : null,
    }));
    res.json({
      message: "Test successful",
      count: students.length,
      students,
    });
  } catch (err) {
    console.error("Test route error:", err);
    res.status(500).json({
      error: err.message,
      message: "Test failed - check Firestore connection",
    });
  }
});

/* -----------------------------------------
 ✅ API ROUTES
----------------------------------------- */
app.use("/api/student", studentRoutes);
app.use("/student", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api", ExamRoutes);
app.use("/api", QuestionBankRoutes);

/* -----------------------------------------
 ✅ ROOT ROUTE
----------------------------------------- */
app.get("/", (req, res) => {
  res.json({
    message: "EdTech Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      test: "/test",
      students: "/api/student",
      classes: "/api/classes",
      batches: "/api/batches",
      blogs: "/api/blogs",
      exams: "/api/exams/:examId/... (see ExamRoutes)",
    },
  });
});

/* -----------------------------------------
 ❌ 404 HANDLER
----------------------------------------- */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `${req.method} ${req.originalUrl} does not exist`,
    availableRoutes: ["/", "/health", "/test", "/api/student"],
  });
});

/* -----------------------------------------
 🔥 GLOBAL ERROR HANDLER
----------------------------------------- */
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

/* -----------------------------------------
 🚀 START SERVER
----------------------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Test Firestore connection on startup
  db.collection("students")
    .limit(1)
    .get()
    .then(() => console.log("✅ Firestore connected successfully"))
    .catch((err) => console.error("❌ Firestore connection failed:", err.message));
});
