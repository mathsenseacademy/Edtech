// src/pages/admin/AdminCreateExamFromBank.jsx
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/layout/AdminHeader";

// Adjust when you deploy
const EXAM_API_BASE = "http://localhost:5000/api";
// This is your existing batches API on Cloud Run
const BATCH_API_BASE = "https://api-bqojuh5xfq-uc.a.run.app/api/batches";

const CreateExamFromBank = () => {
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
  const [batchMode, setBatchMode] = useState("ALL"); // "ALL" or "BATCH"
  const [selectedBatchId, setSelectedBatchId] = useState("");

  const [topics, setTopics] = useState([]); // [{ topic, count }]
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState("");

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState("");

  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batchesError, setBatchesError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [createdExamId, setCreatedExamId] = useState("");

  const classes = [...Array(12).keys()].map((n) => n + 1);

  // Load topics when classId changes
  useEffect(() => {
    setTopics([]);
    setSelectedTopics([]);
    setTotalQuestions("");
    setTopicsError("");
    if (!classId) return;

    const fetchTopics = async () => {
      try {
        setTopicsLoading(true);
        setTopicsError("");
        const params = new URLSearchParams({ classId });
        const res = await fetch(
          `${EXAM_API_BASE}/admin/question-bank/topics?${params.toString()}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load topics");
        }
        setTopics(data.topics || []);
      } catch (err) {
        console.error(err);
        setTopicsError(err.message);
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, [classId]);

  // Load batches when classId changes (for batch dropdown)
  useEffect(() => {
    setBatches([]);
    setSelectedBatchId("");
    setBatchesError("");
    if (!classId) return;

    const fetchBatches = async () => {
      try {
        setBatchesLoading(true);
        setBatchesError("");

        // You already use this endpoint in SdHome for class batches
        const res = await fetch(`${BATCH_API_BASE}/class/${classId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load batches");
        }

        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data) {
          list = [data];
        }

        setBatches(list);
      } catch (err) {
        console.error(err);
        setBatchesError(err.message);
      } finally {
        setBatchesLoading(false);
      }
    };

    fetchBatches();
  }, [classId]);

  const toggleTopic = (topicName) => {
    setSelectedTopics((prev) =>
      prev.includes(topicName)
        ? prev.filter((t) => t !== topicName)
        : [...prev, topicName]
    );
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setCreatedExamId("");

    if (!classId || !title || !code) {
      setCreateError("Please fill Class, Exam Title and Exam Code.");
      return;
    }

    if (!selectedTopics.length) {
      setCreateError("Please select at least one topic.");
      return;
    }

    if (!totalQuestions || Number(totalQuestions) <= 0) {
      setCreateError("Please enter a valid number of questions.");
      return;
    }

    if (batchMode === "BATCH" && !selectedBatchId) {
      setCreateError("Please select a batch or choose All students.");
      return;
    }

    try {
      setCreating(true);

      const adminUid = localStorage.getItem("adminUid");

      const body = {
        title,
        code,
        classId,
        batchId: batchMode === "ALL" ? "ALL" : selectedBatchId,
        timeLimitMinutes: timeLimitMinutes || null,
        topics: selectedTopics,
        totalQuestions: Number(totalQuestions),
        adminUid: adminUid || null,
      };

      const res = await fetch(
        `${EXAM_API_BASE}/admin/exams/create-from-bank`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create exam.");
      }

      setCreateSuccess(
        `Exam created successfully with ${data.questionCount} questions.`
      );
      setCreatedExamId(data.examId || "");
      // optionally keep the form values for next exam or reset some fields
    } catch (err) {
      console.error(err);
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Compute how many questions available for selected topics (just for info)
  const availableQuestions = selectedTopics.length
    ? topics
        .filter((t) => selectedTopics.includes(t.topic))
        .reduce((sum, t) => sum + (t.count || 0), 0)
    : 0;

  return (
    <>
      <AdminHeader />

      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Create Exam from Question Bank
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Select a class, choose one or more topics from the question bank,
            and specify how many questions to include. An exam will be created
            with those questions for the selected class and batch / ALL
            students.
          </p>

          {createError && (
            <div className="mb-3 text-sm text-red-600">{createError}</div>
          )}
          {createSuccess && (
            <div className="mb-3 text-sm text-green-600">
              {createSuccess}
              {createdExamId && (
                <div className="mt-1 text-xs text-gray-700">
                  Exam ID: <span className="font-mono">{createdExamId}</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleCreateExam} className="space-y-5">
            {/* Row: class + title + code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Class */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Class *
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. Trigonometry Test 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Exam Code */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exam Code *
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. TRG-T1"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Topics from Question Bank *
              </label>

              {topicsLoading && (
                <p className="text-sm text-gray-500">Loading topics...</p>
              )}

              {topicsError && (
                <p className="text-sm text-red-600">{topicsError}</p>
              )}

              {!topicsLoading && !topicsError && !topics.length && classId && (
                <p className="text-sm text-gray-500">
                  No topics found for this class. Please upload question bank
                  first.
                </p>
              )}

              {!topicsLoading && !topicsError && topics.length > 0 && (
                <div className="border rounded p-3 max-h-56 overflow-y-auto bg-gray-50">
                  {topics.map((t) => (
                    <label
                      key={t.topic}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTopics.includes(t.topic)}
                          onChange={() => toggleTopic(t.topic)}
                        />
                        <span className="text-sm">{t.topic}</span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {t.count} questions
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {selectedTopics.length > 0 && (
                <p className="mt-1 text-xs text-gray-600">
                  Selected topics have{" "}
                  <span className="font-semibold">
                    {availableQuestions}
                  </span>{" "}
                  questions available in total.
                </p>
              )}
            </div>

            {/* Total questions + time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of questions in this exam *
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. 20"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                />
                {availableQuestions > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    You have {availableQuestions} questions available in the
                    selected topics.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Time limit (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. 30"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(e.target.value)}
                />
              </div>
            </div>

            {/* Batch / ALL */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Assign to *
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="ALL"
                    checked={batchMode === "ALL"}
                    onChange={() => setBatchMode("ALL")}
                  />
                  <span className="text-sm">
                    All students of Class {classId || "?"}
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="BATCH"
                    checked={batchMode === "BATCH"}
                    onChange={() => setBatchMode("BATCH")}
                  />
                  <span className="text-sm">Specific batch</span>
                </label>
              </div>

              {batchMode === "BATCH" && (
                <div className="mt-2">
                  {batchesLoading && (
                    <p className="text-xs text-gray-500">
                      Loading batches...
                    </p>
                  )}
                  {batchesError && (
                    <p className="text-xs text-red-600">{batchesError}</p>
                  )}

                  {!batchesLoading && !batchesError && (
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      className="w-full border rounded px-3 py-2 mt-1"
                    >
                      <option value="">Select batch</option>
                      {batches.map((b) => (
                        <option key={b.id || b.batch_id} value={b.id || b.batch_id}>
                          {b.name || b.batch_name || "Unnamed batch"}
                        </option>
                      ))}
                    </select>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    If you don&apos;t see batches, make sure they are created
                    for this class.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
            >
              {creating ? "Creating exam..." : "Create Exam"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateExamFromBank;
