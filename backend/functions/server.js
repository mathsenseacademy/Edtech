import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load env variables if running locally
dotenv.config();

const app = express();

/* ---------- 1. CORS (ALWAYS FIRST) ---------- */
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

/* ---------- Routes (imports) ---------- */
import { db } from "./firebase/firebaseAdmin.js";
import studentRoutes from "./routes/StudentRoutes.js";
import classRoutes from "./routes/ClassRoutes.js";
import batchRoutes from "./routes/BatchRoutes.js";
import blogRoutes from "./routes/BlogRoutes.js";
import ExamRoutes from "./routes/ExamRoutes.js";
import QuestionBankRoutes from "./routes/QuestionBankRoutes.js";

/* ---------- 2. LOGGER MIDDLEWARE ---------- */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length'],
  });
  next();
});

/* ---------- 3. BODY PARSERS (MOVED UP!) ---------- */
// ✅ CRITICAL: We need this BEFORE the QuestionBank route because we are uploading JSON now.
// Increased limit to 50mb to handle large Question Banks safely.
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* ---------- 4. API ROUTES (ALL GO HERE) ---------- */
// Question Bank is now a standard JSON POST, so it lives here
app.use("/api/admin/question-bank", QuestionBankRoutes);

app.use("/api/student", studentRoutes);
app.use("/student", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", ExamRoutes);

/* ---------- Health & Test routes ---------- */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

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

/* ---------- Root route ---------- */
app.get("/", (req, res) => {
  res.json({
    message: "EdTech Backend API (functions) is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      test: "/test",
      students: "/api/student",
    },
  });
});

/* ---------- 404 handler ---------- */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `${req.method} ${req.originalUrl} does not exist`,
    availableRoutes: ["/", "/health", "/test", "/api/student"],
  });
});

/* ---------- Global error handler ---------- */
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

/* ---------- Export for Cloud Functions / serverless ---------- */
export default app;