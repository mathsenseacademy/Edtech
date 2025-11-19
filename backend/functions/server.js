import express from "express";
import cors from "cors";
import { StudentModel } from "./models/StudentModel.js";
import { db } from "./firebase/firebaseAdmin.js";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "www.mathsenseacademy.com",
      "https://mathsenseacademy-55f13.web.app",
      "https://mathsenseacademy-55f13.firebaseapp.com",
      "https://mathsenseacademy.com"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);


// ✅ Routes
import studentRoutes from "./routes/StudentRoutes.js";
import classRoutes from "./routes/ClassRoutes.js";
import batchRoutes from "./routes/BatchRoutes.js";
import blogRoutes from "./routes/BlogRoutes.js";

app.use("/api/student", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/blogs", blogRoutes);

// ✅ Health route
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});


export default app;
