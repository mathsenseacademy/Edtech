// src/api/examApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// Get exams for a student (class+batch based)
export async function getStudentExams(studentId) {
  const res = await fetch(`${API_BASE}/api/students/${studentId}/exams`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load exams");
  return data; // { classId, batchId, exams: [...] }
}

export async function startExam(examId, studentId, randomize = false) {
  const res = await fetch(
    `${API_BASE}/api/exams/${examId}/start${randomize ? "?randomize=true" : ""}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to start exam");
  return data; // { attemptId, questionOrder, timeLimitMinutes, examId }
}

export async function getExamQuestions(examId) {
  const res = await fetch(`${API_BASE}/api/exams/${examId}/questions`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load questions");
  return data; // { examId, title, timeLimitMinutes, questions: [...] }
}

export async function submitExam(examId, body) {
  const res = await fetch(`${API_BASE}/api/exams/${examId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Submit failed");
  return data;
}
