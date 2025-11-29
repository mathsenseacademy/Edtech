// src/pages/StudentExamsPage.jsx
import React, { useEffect, useState } from "react";
import ExamPlayer from "./ExamPlayer"; // adjust path if needed
import { getStudentExams } from "../api/examApi";

export default function StudentExamsPage({ studentId }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getStudentExams(studentId);
        setExams(data.exams || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not load exams");
      } finally {
        setLoading(false);
      }
    }
    if (studentId) load();
  }, [studentId]);

  if (selectedExamId) {
    // When an exam is chosen, show the exam player
    return (
      <ExamPlayer
        examId={selectedExamId}
        studentId={studentId}
        // if your ExamPlayer still takes apiBase, you can pass it here
        // apiBase={import.meta.env.VITE_API_BASE_URL || ""}
        randomize={true}
      />
    );
  }

  if (loading) return <div>Loading your exams...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!exams.length) return <div>No exams assigned to you yet.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>My Exams</h2>
      <ul>
        {exams.map((exam) => (
          <li key={exam.examId} style={{ margin: "12px 0", padding: 8, border: "1px solid #ddd", borderRadius: 6 }}>
            <div><strong>{exam.title}</strong> ({exam.code})</div>
            {exam.timeLimitMinutes && (
              <div>Time limit: {exam.timeLimitMinutes} minutes</div>
            )}
            <button
              style={{ marginTop: 6 }}
              onClick={() => setSelectedExamId(exam.examId)}
            >
              Start Exam
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
