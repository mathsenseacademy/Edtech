import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/layout/AdminHeader";
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // Update to your backend URL

const Exam = () => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const classes = [...Array(12).keys()].map((n) => n + 1);

  // Load Batches according to selected class
  useEffect(() => {
    async function fetchBatches() {
      if (!selectedClass) return setBatches([]);

      try {
        const res = await axios.get(
          `${API_BASE}/batches/class/${selectedClass}`
        );
        const data = res.data;

        if (Array.isArray(data)) setBatches(data);
        else if (data) setBatches([data]);
        else setBatches([]);
      } catch (err) {
        console.log(err);
        setBatches([]);
      }
    }
    fetchBatches();
  }, [selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!title || !code || !selectedClass || !selectedBatch || !file) {
      return setError("Please fill title, class, batch and upload file");
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", title);
      formData.append("code", code);
      formData.append("classId", selectedClass);
      formData.append("batchId", selectedBatch);

      if (timeLimitMinutes) {
        formData.append("timeLimitMinutes", timeLimitMinutes);
      }

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE}/admin/exams/upload`, {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setMessage("Exam uploaded successfully!");
      setTitle("");
      setSelectedClass("");
      setSelectedBatch("");
      setTimeLimitMinutes("");
      setFile(null);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="pt-24 px-4">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Upload Exam</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title */}
            <div>
              <label>Exam Title *</label>
              <input
                className="border rounded w-full p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Algebra Chapter 1 Test"
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

            {/* Class Dropdown */}
            <div>
              <label>Select Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border w-full rounded p-2"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Dropdown */}
            <div>
              <label>Select Batch *</label>
              <select
                className="border w-full rounded p-2"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                disabled={!selectedClass}
              >
                <option value="">
                  {selectedClass ? "Select Batch" : "Select class first"}
                </option>

                {/* All students option */}
                <option value="ALL">All students of this class</option>

                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Timer */}
            <div>
              <label>Time Limit (minutes)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                min={1}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                placeholder="30"
              />
            </div>

            {/* File */}
            <div>
              <label>Upload Excel *</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {/* Status messages */}
            {error && <div className="text-red-600">{error}</div>}
            {message && <div className="text-green-600">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded"
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
