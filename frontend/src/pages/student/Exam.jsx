// src/pages/student/Exam.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const StudentExam = () => {
  const { examId } = useParams(); // URL: /student/exam/:examId
  const navigate = useNavigate();

  const [examTitle, setExamTitle] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(null);

  const [questions, setQuestions] = useState([]);        // ordered list
  const [answers, setAnswers] = useState({});            // { [questionId]: "A" }
  const [currentIndex, setCurrentIndex] = useState(0);   // which question is shown

  const [attemptId, setAttemptId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);        // seconds

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [result, setResult] = useState(null);            // {score, totalQuestions, ...}

  const studentId = localStorage.getItem("studentUid");  // or whatever you use

  // Format timer as mm:ss
  const formatTime = (seconds) => {
    if (seconds == null) return "--:--";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // Step 1: load questions + start exam
  useEffect(() => {
    if (!examId) return;
    if (!studentId) {
      setError("Not logged in as student.");
      setLoading(false);
      return;
    }

    const loadExam = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        // 1) Get questions + exam meta
        const qRes = await fetch(`${API_BASE}/exams/${examId}/questions`);
        const qData = await qRes.json();
        if (!qRes.ok) throw new Error(qData.error || "Failed to load questions");

        const baseQuestions = qData.questions || [];
        setExamTitle(qData.title || "");
        if (qData.timeLimitMinutes) {
          setTimeLimitMinutes(qData.timeLimitMinutes);
          setTimeLeft(qData.timeLimitMinutes * 60);
        }

        // 2) Start exam -> create attempt and get questionOrder
        const startRes = await fetch(
          `${API_BASE}/exams/${examId}/start?randomize=true`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ studentId }),
          }
        );
        const startData = await startRes.json();
        if (!startRes.ok)
          throw new Error(startData.error || "Failed to start exam");

        setAttemptId(startData.attemptId);

        // Use questionOrder from attempt (array of question IDs) to order questions
        const order = startData.questionOrder || [];

        // We assume ExamModel.getQuestionsForExam returns each question with an "id" field
        const qMap = {};
        baseQuestions.forEach((q) => {
          const id = q.id || q.questionId; // adjust if needed
          if (id) qMap[id] = { ...q, id };
        });

        const orderedQs =
          order.length > 0
            ? order.map((id) => qMap[id]).filter(Boolean)
            : baseQuestions.map((q) => ({
                ...q,
                id: q.id || q.questionId,
              }));

        setQuestions(orderedQs);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId, studentId]);

  // Step 2: timer countdown
  useEffect(() => {
    if (timeLeft == null) return;
    if (timeLeft <= 0) {
      // time up -> auto submit once
      if (!result && attemptId) {
        handleSubmit(true);
      }
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, attemptId, result]);

  // Handle answer change
  const handleAnswerChange = (questionId, optionKey) => {
    if (result) return; // lock answers after submit
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Submit exam (manual or auto)
  const handleSubmit = async (auto = false) => {
    if (!examId || !attemptId || !studentId) return;
    if (submitting || result) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const payload = {
        studentId,
        attemptId,
        answers,
        autoSubmit: auto,
      };

      const res = await fetch(`${API_BASE}/exams/${examId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit exam");

      setResult({
        score: data.score,
        totalQuestions: data.totalQuestions,
        correctCount: data.correctCount,
        wrongCount: data.wrongCount,
        timedOut: data.timedOut,
      });

      setMessage(
        `Exam submitted successfully! Your score: ${data.score}/${data.totalQuestions}`
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Navigation helpers
  const goPrev = () => {
    setCurrentIndex((idx) => (idx > 0 ? idx - 1 : idx));
  };

  const goNext = () => {
    setCurrentIndex((idx) =>
      idx < questions.length - 1 ? idx + 1 : idx
    );
  };

  const currentQuestion = questions[currentIndex];
  const currentQId = currentQuestion?.id || currentQuestion?.questionId;
  const currentSelected = currentQId ? answers[currentQId] || "" : "";

  // Render one question
  const renderCurrentQuestion = () => {
    if (!currentQuestion) return null;

    const q = currentQuestion;
    const qId = currentQId;
    const opts = q.options || {};

    return (
      <div className="border rounded p-4">
        <div className="font-medium mb-3">
          Q{q.questionNo || currentIndex + 1}. {q.text}
        </div>

        {q.type === "MCQ" ? (
          <div className="space-y-2">
            {Object.entries(opts).map(([key, text]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q-${qId}`}
                  value={key}
                  checked={currentSelected === key}
                  disabled={!!result}
                  onChange={() => handleAnswerChange(qId, key)}
                />
                <span>
                  <strong>{key})</strong> {text}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            className="w-full border rounded px-2 py-1"
            rows={3}
            placeholder="Write your answer"
            value={currentSelected}
            disabled={!!result}
            onChange={(e) => handleAnswerChange(qId, e.target.value)}
          />
        )}
      </div>
    );
  };

  // Loading / error states
  if (loading) {
    return (
      <div className="pt-24 px-4">
        <div className="max-w-3xl mx-auto">Loading exam...</div>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="pt-24 px-4">
        <div className="max-w-3xl mx-auto text-red-600">{error}</div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          No questions found for this exam.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-4 md:p-6">
        {/* Top header: title + timer */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{examTitle}</h2>
            <p className="text-xs md:text-sm text-gray-600">
              Exam ID: {examId}
            </p>
          </div>

          {timeLimitMinutes && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Time Left</div>
              <div className="text-lg md:text-xl font-mono">
                {formatTime(timeLeft)}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        {error && <div className="mb-3 text-red-600">{error}</div>}
        {message && <div className="mb-3 text-green-600">{message}</div>}

        {/* Layout: left question list + main question */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left: question navigator */}
          <div className="md:w-1/4">
            <h3 className="font-semibold mb-2 text-sm md:text-base">
              Questions
            </h3>
            <div className="grid grid-cols-5 md:grid-cols-3 gap-2">
              {questions.map((q, idx) => {
                const qId = q.id || q.questionId;
                const answered = !!answers[qId];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={qId || idx}
                    type="button"
                    disabled={!!result} // optional; can allow navigation after submit
                    onClick={() => setCurrentIndex(idx)}
                    className={[
                      "w-10 h-10 text-sm flex items-center justify-center rounded-md border",
                      "transition-colors duration-150",
                      isCurrent
                        ? "bg-blue-600 text-white border-blue-700"
                        : answered
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-gray-100 text-gray-800 border-gray-300",
                    ].join(" ")}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle: current question + controls */}
          <div className="flex-1 flex flex-col">
            {renderCurrentQuestion()}

            {/* Navigation buttons */}
            {!result && (
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded border text-sm md:text-base disabled:opacity-50"
                >
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-4 py-2 rounded bg-blue-600 text-white text-sm md:text-base"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded bg-green-600 text-white text-sm md:text-base disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Finish Exam"}
                  </button>
                )}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Result</h3>
                <p>
                  Score:{" "}
                  <strong>{result.score}</strong> / {result.totalQuestions}
                </p>
                <p>Correct: {result.correctCount}</p>
                <p>Wrong: {result.wrongCount}</p>
                {result.timedOut && (
                  <p className="text-red-600 mt-1">
                    Note: Exam was auto-submitted due to timeout.
                  </p>
                )}
                <button
                  className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
                  onClick={() => navigate("/student/dashboard")}
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExam;
