import React, { useState } from "react";
import AdminHeader from "../../components/layout/AdminHeader"; 

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const Exam = () => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [classId, setClassId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select an Excel file.");
      return;
    }
    if (!title || !code || !classId || !batchId) {
      setError("Title, Code, Class, and Batch are required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file); // backend expects field name "file"
      formData.append("title", title);
      formData.append("code", code);
      formData.append("classId", classId);
      formData.append("batchId", batchId);
      if (timeLimitMinutes) {
        formData.append("timeLimitMinutes", timeLimitMinutes);
      }

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE}/api/admin/exams/upload`, {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload exam");
      }

      setMessage(`Exam uploaded successfully! Exam ID: ${data.examId}`);
      setTitle("");
      setCode("");
      setClassId("");
      setBatchId("");
      setTimeLimitMinutes("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="pt-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Create / Upload Exam</h1>
          <p className="text-sm text-gray-600 mb-4">
            Upload an Excel file containing questions and map it to a Class & Batch.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Exam Title *
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Algebra Test - Chapter 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Exam Code *
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. ALG-CH1"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Class ID *
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. CLASS_8"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                />
                {/* You can replace this with a select dropdown of classes from API */}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Batch ID *
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. BATCH_A1"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                />
                {/* You can replace this with a select dropdown of batches from API */}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Time Limit (minutes)
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

            <div>
              <label className="block text-sm font-medium mb-1">
                Excel File *
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Expected columns: <code>question_no</code>,{" "}
                <code>question_text</code>, <code>question_type</code>,{" "}
                <code>option_a</code>, <code>option_b</code>,{" "}
                <code>option_c</code>, <code>option_d</code>,{" "}
                <code>correct_option</code>.
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            {message && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Exam"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Exam;
