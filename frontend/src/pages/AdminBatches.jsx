import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://mathsenseacademy.onrender.com/api";

const AdminBatches = () => {
  const [classes] = useState([...Array(12).keys()].map((n) => n + 1));
  const [selectedClass, setSelectedClass] = useState(null);
  const [batches, setBatches] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch batches for selected class
  const fetchBatches = async (cls) => {
    try {
      const res = await axios.get(`${API_BASE}/batches/class/${cls}`);
      setBatches(res.data || []);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setBatches([]);
    }
  };

  // Fetch assigned and unassigned students for selected batch
  const fetchBatchStudents = async (batchId, cls) => {
    if (!batchId || !cls) return;
    try {
      const [allStudentsRes, batchStudentsRes] = await Promise.all([
        axios.get(`${API_BASE}/student/class/${cls}`),
        axios.get(`${API_BASE}/batches/${batchId}/students`),
      ]);

      const allStudents = allStudentsRes.data || [];
      const assigned = batchStudentsRes.data || [];
      const assignedIds = new Set(assigned.map((s) => s.id));

      const unassigned = allStudents.filter((s) => !assignedIds.has(s.id));

      setAssignedStudents(assigned);
      setUnassignedStudents(unassigned);
    } catch (err) {
      console.error("Error fetching batch students:", err);
      setAssignedStudents([]);
      setUnassignedStudents([]);
    }
  };

  // When class changes
  useEffect(() => {
    if (selectedClass) {
      fetchBatches(selectedClass);
      setSelectedBatch(null);
      setAssignedStudents([]);
      setUnassignedStudents([]);
    }
  }, [selectedClass]);

  // Create new batch
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
      alert("✅ Batch created!");
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
      await axios.delete(`${API_BASE}/batches/${batchId}`);
      fetchBatches(selectedClass);
      if (selectedBatch?.id === batchId) {
        setSelectedBatch(null);
        setAssignedStudents([]);
        setUnassignedStudents([]);
      }
      alert("🗑️ Batch deleted");
    } catch (err) {
      console.error("Error deleting batch:", err);
    }
  };

  // Assign a student
  const assignStudent = async (studentUid) => {
  if (!selectedBatch) return alert("Select a batch first!");
  try {
    await axios.post(`${API_BASE}/batches/${selectedBatch.id}/assign`, {
      studentUid, // ✅ changed
    });
    fetchBatchStudents(selectedBatch.id, selectedClass);
  } catch (err) {
    console.error("Error assigning student:", err);
  }
};

// Unassign a student
const unassignStudent = async (studentUid) => {
  if (!selectedBatch) return alert("Select a batch first!");
  try {
    await axios.post(`${API_BASE}/batches/${selectedBatch.id}/unassign`, {
      studentUid, // ✅ changed
    });
    fetchBatchStudents(selectedBatch.id, selectedClass);
  } catch (err) {
    console.error("Error unassigning student:", err);
  }
};

  // When selecting a batch
  const handleBatchClick = (b) => {
    setSelectedBatch(b);
    fetchBatchStudents(b.id, selectedClass);
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
        <div className="grid md:grid-cols-3 gap-6">
          {/* Batches */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg text-blue-700 mb-3">
              Batches for Class {selectedClass}
            </h2>

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

            <ul className="space-y-2">
              {batches.map((b) => (
                <li
                  key={b.id}
                  className={`p-3 border rounded flex justify-between items-center cursor-pointer ${
                    selectedBatch?.id === b.id
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white"
                  }`}
                >
                  <span
                    onClick={() => handleBatchClick(b)}
                    className="font-semibold text-blue-700"
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

          {/* Assigned Students */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg text-green-700 mb-3">
              Assigned Students
            </h2>
            {selectedBatch ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {assignedStudents.length > 0 ? (
                  assignedStudents.map((s) => (
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
                        onClick={() => unassignStudent(s.id)}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Unassign
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No assigned students.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Select a batch to see assigned students.
              </p>
            )}
          </div>

          {/* Unassigned Students */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg text-orange-700 mb-3">
              Unassigned Students
            </h2>
            {selectedBatch ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {unassignedStudents.length > 0 ? (
                  unassignedStudents.map((s) => (
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
                        onClick={() => assignStudent(s.id)}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Assign
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">All students assigned!</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Select a batch to see unassigned students.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBatches;
