// backend/server.js
import express from "express";
import cors from "cors";
import * as functions from "firebase-functions";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // Load .env

// ---------- Firebase Admin Initialization ----------
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: "dummy", // optional if you want to include it
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ---------- Express App ----------
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:5173",
  "https://mathsenseacademy.com",
  "https://www.mathsenseacademy.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ---------- Routes ----------
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/test", async (req, res) => {
  try {
    const snapshot = await db.collection("students").limit(5).get();
    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      google_uid: doc.data().google_uid ? "***hidden***" : null,
    }));
    res.json({ message: "Test successful", count: students.length, students });
  } catch (err) {
    console.error("Test route error:", err);
    res.status(500).json({ error: err.message, message: "Check Firestore connection" });
  }
});

import studentRoutes from "./routes/StudentRoutes.js";
app.use("/api/student", studentRoutes);
app.use("/student", studentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "EdTech Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ---------- Error Handling ----------
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `${req.method} ${req.originalUrl} does not exist`,
  });
});

app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// ---------- Export as Firebase Function ----------
export const api = functions.https.onRequest(app);
