import React, { useEffect, useState, useCallback } from "react";

export default function ExamPlayer({
  examId,
  studentId,
  apiBase = "",        // e.g. "https://your-cloud-run-url" (no trailing slash)
  randomize = false,   // if true, uses ?randomize=true on startExam
}) {
  const [attemptId, setAttemptId] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [questionOrder, setQuestionOrder] = useState([]); // array of questionIds in the order for this attempt
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: "A" }

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [timeLimitSeconds, setTimeLimitSeconds] = useState(null); // total seconds allowed
  const [remainingSeconds, setRemainingSeconds] = useState(null); // countdown state

  // ---------- Helpers ----------

  function formatTime(seconds) {
    if (seconds == null) return "";
    const s = Math.max(0, seconds);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  const orderedQuestions = questionOrder.length
    ? questionOrder
        .map((qid) => questions.find((q) => q.questionId === qid))
        .filter(Boolean)
    : questions;

  const q = orderedQuestions[currentIndex] || null;
  const selected = q ? answers[q.questionId] || null : null;

  // ---------- API calls ----------

  // 1) Start exam (create attempt) then load questions
  useEffect(() => {
    async function initExam() {
      try {
        setLoading(true);
        setStarting(true);

        // Start exam → get attemptId, questionOrder, timeLimitMinutes
        const startRes = await fetch(
          `${apiBase}/api/exams/${examId}/start${randomize ? "?randomize=true" : ""}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId }),
          }
        );
        const startData = await startRes.json();
        if (!startRes.ok) throw new Error(startData.error || "Failed to start exam");

        setAttemptId(startData.attemptId);
        if (Array.isArray(startData.questionOrder)) {
          setQuestionOrder(startData.questionOrder);
        }

        if (startData.timeLimitMinutes) {
          const totalSeconds = Number(startData.timeLimitMinutes) * 60;
          setTimeLimitSeconds(totalSeconds);
          setRemainingSeconds(totalSeconds);
        } else {
          setTimeLimitSeconds(null);
          setRemainingSeconds(null);
        }

        // Load questions (hides correct answers)
        const qRes = await fetch(`${apiBase}/api/exams/${examId}/questions`);
        const qData = await qRes.json();
        if (!qRes.ok) throw new Error(qData.error || "Failed to load questions");

        setQuestions(qData.questions || []);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
        alert("Error initializing exam: " + err.message);
      } finally {
        setStarting(false);
        setLoading(false);
      }
    }

    if (examId && studentId) {
      initExam();
    }
  }, [examId, studentId, apiBase, randomize]);

  // 2) Countdown timer effect
  useEffect(() => {
    if (timeLimitSeconds == null) return;

    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev == null) return prev;
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [timeLimitSeconds]);

  // 3) Submit answers (manual or auto)
  const submitAnswers = useCallback(
    async (autoSubmit = false) => {
      if (!attemptId) {
        alert("Attempt not initialized properly.");
        return;
      }
      if (submitting || result) return; // avoid double submit

      if (!autoSubmit) {
        const ok = window.confirm("Submit exam? You won't be able to change answers.");
        if (!ok) return;
      }

      setSubmitting(true);
      try {
        const body = { studentId, attemptId, answers };
        const res = await fetch(`${apiBase}/api/exams/${examId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Submit failed");

        if (autoSubmit) {
          alert("Time is up! Your answers have been auto-submitted.");
        }
        setResult(data);
      } catch (err) {
        console.error(err);
        alert("Submit failed: " + err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [answers, attemptId, examId, apiBase, studentId, submitting, result]
  );

  // 4) Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLimitSeconds == null) return;
    if (remainingSeconds === 0 && !submitting && !result) {
      submitAnswers(true);
    }
  }, [remainingSeconds, timeLimitSeconds, submitting, result, submitAnswers]);

  // ---------- UI handlers ----------

  function selectOption(key) {
    if (!q || result) return;
    setAnswers((prev) => ({ ...prev, [q.questionId]: key }));
  }

  function goNext() {
    if (currentIndex < orderedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  // ---------- Renders ----------

  if (loading || starting) {
    return <div>Starting your exam...</div>;
  }

  if (!orderedQuestions.length) {
    return <div>No questions found for this exam.</div>;
  }

  if (result) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2>Result</h2>
        <p>
          You scored <strong>{result.score}</strong> out of{" "}
          <strong>{result.totalQuestions}</strong>
        </p>
        {result.timedOut && (
          <p style={{ color: "red" }}>
            Note: Your attempt was submitted after time ran out (timed out:{" "}
            {String(result.timedOut)})
          </p>
        )}

        {/* Optional: simple review */}
        <details style={{ marginTop: 16 }}>
          <summary>View detailed answers</summary>
          <ul>
            {orderedQuestions.map((qItem, idx) => {
              const resForQ =
                result.perQuestionResult &&
                result.perQuestionResult[qItem.questionId];
              if (!resForQ) return null;
              return (
                <li key={qItem.questionId} style={{ marginBottom: 8 }}>
                  <div>
                    <strong>Q{idx + 1}:</strong> {qItem.text}
                  </div>
                  <div>
                    Your answer: {resForQ.selected || "Not answered"} | Correct:{" "}
                    {resForQ.correct || "N/A"} |{" "}
                    {resForQ.isCorrect ? "✅ Correct" : "❌ Wrong"}
                  </div>
                </li>
              );
            })}
          </ul>
        </details>

        <button
          style={{ marginTop: 16 }}
          onClick={() => window.location.reload()}
        >
          Close / Refresh
        </button>
      </div>
    );
  }

  if (!q) return <div>Could not load current question.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header: Timer + Progress */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <div>
          Question {currentIndex + 1} / {orderedQuestions.length}
        </div>
        {timeLimitSeconds != null && (
          <div style={{ fontWeight: "bold" }}>
            Time left:{" "}
            <span style={{ color: remainingSeconds <= 30 ? "red" : "inherit" }}>
              {formatTime(remainingSeconds)}
            </span>
          </div>
        )}
      </div>

      {/* Question & Options */}
      <div style={{ marginBottom: 16 }}>
        <p>{q.text}</p>
        <div>
          {Object.entries(q.options).map(([key, text]) => (
            <div key={key} style={{ margin: "8px 0" }}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  name={`q_${q.questionId}`}
                  value={key}
                  disabled={!!result}
                  checked={selected === key}
                  onChange={() => selectOption(key)}
                />{" "}
                <strong>{key}.</strong> {text}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation & Submit */}
      <div style={{ marginTop: 16 }}>
        <button onClick={goPrev} disabled={currentIndex === 0 || submitting}>
          Previous
        </button>{" "}
        {currentIndex < orderedQuestions.length - 1 ? (
          <button onClick={goNext} disabled={submitting}>
            Next
          </button>
        ) : (
          <button onClick={() => submitAnswers(false)} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <small>
          Answered {Object.keys(answers).length} of {orderedQuestions.length}
        </small>
      </div>
    </div>
  );
}
