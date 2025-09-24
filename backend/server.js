import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables before anything else
dotenv.config();

import { db } from "./firebase/firebaseAdmin.js";
import studentRoutes from "./routes/StudentRoutes.js";

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
    "http://localhost:5173", 
    "www.mathsenseacademy.com",
    "https://mathsenseacademy-55f13.web.app",
    "https://mathsenseacademy-55f13.firebaseapp.com",
    "https://mathsenseacademy.com"
  ], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

// Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.query);
  next();
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route: get all students (for debugging)
app.get("/test", async (req, res) => {
  try {
    const snapshot = await db.collection("students").limit(5).get(); // Limit for testing
    const students = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      // Hide sensitive data in test route
      google_uid: doc.data().google_uid ? '***hidden***' : null
    }));
    res.json({ 
      message: "Test successful", 
      count: students.length,
      students 
    });
  } catch (err) {
    console.error("Test route error:", err);
    res.status(500).json({ 
      error: err.message,
      message: "Test failed - check Firestore connection"
    });
  }
});

// API Routes
app.use("/api/student", studentRoutes); // Prefix with /api for better organization
app.use("/student", studentRoutes); // Keep existing route for backward compatibility

// Future routes (uncomment when ready)
// app.use("/api/courses", coursesRoutes);
// app.use("/api/curriculums", curriculumRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "EdTech Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      test: "/test",
      students: "/api/student",
      legacy_students: "/student"
    }
  });
});

// 404 handler (must be last, no '*' pattern needed)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `${req.method} ${req.originalUrl} does not exist`,
    availableRoutes: ["/", "/health", "/test", "/api/student", "/student"]
  });
});


// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`👥 Students API: http://localhost:${PORT}/api/student`);
  
  // Test Firestore connection on startup
  db.collection("students").limit(1).get()
    .then(() => console.log("✅ Firestore connected successfully"))
    .catch(err => console.error("❌ Firestore connection failed:", err.message));
});