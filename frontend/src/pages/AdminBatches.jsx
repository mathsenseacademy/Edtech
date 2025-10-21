import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://mathsenseacademy.onrender.com/api";

const AdminBatches = () => {
  const [classes] = useState([...Array(12).keys()].map((n) => n + 1));
  const [selectedClass, setSelectedClass] = useState(null);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch batches for selected class
  const fetchBatches = async (cls) => {
    if (!cls) return;
    try {
      const res = await axios.get(`${API_BASE}/batches/class/${cls}`);
      setBatches(res.data || []);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setBatches([]);
    }
  };

  // Fetch students of selected class
  const fetchStudents = async (cls) => {
    try {
      const res = await axios.get(`${API_BASE}/student/class/${cls}`);
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
  };

  // When class changes
  useEffect(() => {
    if (selectedClass) {
      fetchBatches(selectedClass);
      fetchStudents(selectedClass);
      setSelectedBatch(null);
    }
  }, [selectedClass]);

  // Create or update batch
  const saveBatch = async () => {
    if (!batchName || !selectedClass) return alert("Please fill all fields");

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/batches`, {
        name: batchName,
        classNumber: selectedClass,
      });
      setBatchName("");
      fetchBatches(selectedClass);
      alert("✅ Batch saved!");
    } catch (err) {
      console.error("Error saving batch:", err);
      alert("Failed to save batch");
    } finally {
      setLoading(false);
    }
  };

  // Delete batch
  const deleteBatch = async (batchId) => {
    if (!window.confirm("Delete this batch?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/batches/${batchId}`);
      fetchBatches(selectedClass);
      if (selectedBatch?.id === batchId) setSelectedBatch(null);
      alert("🗑️ Batch deleted");
    } catch (err) {
      console.error("Error deleting batch:", err);
    } finally {
      setLoading(false);
    }
  };

  // Assign/unassign student to batch
  const toggleStudentBatch = async (studentId) => {
    if (!selectedBatch) return alert("Select a batch first!");
    try {
      await axios.post(`${API_BASE}/batches/${selectedBatch.id}/toggle`, {
        studentId,
      });
      fetchStudents(selectedClass);
      alert("✅ Updated batch membership");
    } catch (err) {
      console.error("Error toggling student batch:", err);
      alert("Failed to update batch membership");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Manage Batches</h1>

      {/* Class Selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-3 py-2 rounded border font-semibold ${
              selectedClass === cls
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-600 border-blue-400 hover:bg-blue-50"
            }`}
          >
            Class {cls}
          </button>
        ))}
      </div>

      {selectedClass && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Batch Management */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg text-blue-700 mb-3">
              Batches for Class {selectedClass}
            </h2>

            {/* Create / Edit Batch */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Batch name (e.g., Alpha)"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={saveBatch}
                disabled={loading}
                className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>

            {/* Batch List */}
            <ul className="space-y-2">
              {batches.map((b) => (
                <li
                  key={b.id}
                  className={`p-3 border rounded flex justify-between items-center ${
                    selectedBatch?.id === b.id
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white"
                  }`}
                >
                  <span
                    onClick={() => setSelectedBatch(b)}
                    className="font-semibold cursor-pointer text-blue-700"
                  >
                    {b.name}
                  </span>
                  <button
                    onClick={() => deleteBatch(b.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Assignment */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg text-blue-700 mb-3">
              Students in Class {selectedClass}
            </h2>
            {selectedBatch ? (
              <p className="mb-2 text-sm text-gray-600">
                Assign to: <b>{selectedBatch.name}</b>
              </p>
            ) : (
              <p className="mb-2 text-sm text-gray-500">
                Select a batch to assign students.
              </p>
            )}

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <p className="font-semibold">
                      {s.first_name} {s.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{s.email}</p>
                  </div>
                  <button
                    onClick={() => toggleStudentBatch(s.id)}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Toggle
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBatches;
