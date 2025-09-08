import express from "express";
import { db } from "./firebase/firebaseConfig.js";
import coursesRoutes from "./routes/courses.js";
import curriculumRoutes from "./routes/curriculums.js";
import classroomEssentialsRoutes from "./routes/classroomEssentials.js";
import classLevelsRoutes from "./routes/classLevels.js";
import categoryLevelsRoutes from "./routes/categoryLevels.js";

const app = express();
app.use(express.json());

// Test route: get all students
app.get("/test", async (req, res) => {
  const snapshot = await db.collection("students").get();
  const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(students);
});

app.use("/api/courses", coursesRoutes);

app.use("/api/curriculums", curriculumRoutes);

app.use("/api/classroom-essentials", classroomEssentialsRoutes);

app.use("/api/class-levels", classLevelsRoutes);

app.use("/api/category-levels", categoryLevelsRoutes);


app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
