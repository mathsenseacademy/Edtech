// src/pages/admin/QuestionBankUpload.jsx
import React, { useState } from "react";
import AdminHeader from "../../components/layout/AdminHeader";

// 👇 change to your deployed backend URL when needed
const API_BASE = "http://localhost:5000/api";

const AdminQuestionBankUpload = () => {
  const [classId, setClassId] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const classes = [...Array(12).keys()].map((n) => n + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!classId || !topic || !file) {
      setErrorMsg("Please select class, enter topic and upload an Excel file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("classId", classId);
      formData.append("topic", topic.trim());

      // optional: adminUid if you store it
      const adminUid = localStorage.getItem("adminUid");
      if (adminUid) {
        formData.append("adminUid", adminUid);
      }

      const res = await fetch(`${API_BASE}/admin/question-bank/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload question bank.");
      }

      setSuccessMsg(
        `Uploaded ${data.count || ""} questions for Class ${data.classId} – Topic: ${data.topic}`
      );
      setClassId("");
      setTopic("");
      setFile(null);
      // clear file input visually
      e.target.reset?.();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="pt-24 px-4">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Upload Question Bank (Excel)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload an Excel file with questions for a specific class and topic.
            These questions will be stored in the question bank, and later you
            can create exams by selecting topics and number of questions.
          </p>

          {errorMsg && (
            <div className="mb-3 text-sm text-red-600">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="mb-3 text-sm text-green-600">{successMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Topic / Chapter Name *
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Trigonometry – Heights and Distances"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* File */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Excel File *
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Expected columns (flexible names): question, option A/B/C/D,
                correct option, type (MCQ).
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Question Bank"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminQuestionBankUpload;
