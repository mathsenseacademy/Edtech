// src/pages/AdminBatches.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://api-bqojuh5xfq-uc.a.run.app/api";

const AdminBatches = () => {
  const [classes] = useState([...Array(12).keys()].map((n) => n + 1));
  const [selectedClass, setSelectedClass] = useState(null);
  const [batches, setBatches] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Batch form inputs
  const [batchName, setBatchName] = useState("");
  const [batchDay, setBatchDay] = useState("");
  const [batchTime, setBatchTime] = useState("");
  const [batchDay2, setBatchDay2] = useState("");
  const [batchTime2, setBatchTime2] = useState("");

  // Editing fields
  const [editDay, setEditDay] = useState("");
  const [editTime, setEditTime] = useState("");
  const [loading, setLoading] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // ✅ Fetch batches for selected class
  const fetchBatches = async (cls) => {
    try {
      const res = await axios.get(`${API_BASE}/batches/class/${cls}`);
      const data = res.data;
      if (Array.isArray(data)) setBatches(data);
      else if (data && typeof data === "object") setBatches([data]);
      else setBatches([]);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setBatches([]);
    }
  };

  // ✅ Fetch assigned/unassigned students
  const fetchBatchStudents = async (batchId, cls) => {
    if (!batchId || !cls) return;
    try {
      const [allRes, assignedRes] = await Promise.all([
        axios.get(`${API_BASE}/student/class/${cls}`),
        axios.get(`${API_BASE}/batches/${batchId}/students`),
      ]);
      const all = allRes.data || [];
      const assigned = assignedRes.data || [];
      const assignedIds = new Set(assigned.map((s) => s.id));
      const unassigned = all.filter((s) => !assignedIds.has(s.id));
      setAssignedStudents(assigned);
      setUnassignedStudents(unassigned);
    } catch (err) {
      console.error("Error fetching batch students:", err);
      setAssignedStudents([]);
      setUnassignedStudents([]);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchBatches(selectedClass);
      setSelectedBatch(null);
      setAssignedStudents([]);
      setUnassignedStudents([]);
    }
  }, [selectedClass]);

  // ✅ Create new batch
  const saveBatch = async () => {
    if (!batchName || !selectedClass || !batchDay || !batchTime) {
      return alert("Please fill all required fields (name, day, time).");
    }

    // Check optional pair logic
    if ((batchDay2 && !batchTime2) || (!batchDay2 && batchTime2)) {
      return alert("Both second day and second time must be filled together.");
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/batches`, {
        name: batchName,
        classNumber: selectedClass,
        day: batchDay,
        time: batchTime,
        day2: batchDay2 || null,
        time2: batchTime2 || null,
      });

      setBatchName("");
      setBatchDay("");
      setBatchTime("");
      setBatchDay2("");
      setBatchTime2("");
      fetchBatches(selectedClass);
      alert("✅ Batch created successfully!");
    } catch (err) {
      console.error("Error saving batch:", err);
      alert("Failed to save batch");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update batch
  const updateBatch = async (batchId) => {
    if (!editDay || !editTime)
      return alert("Please select both day and time to update.");
    try {
      await axios.put(`${API_BASE}/batches/${batchId}`, {
        day: editDay,
        time: editTime,
      });
      fetchBatches(selectedClass);
      alert("✅ Batch updated successfully!");
      setEditDay("");
      setEditTime("");
      setSelectedBatch(null);
    } catch (err) {
      console.error("Error updating batch:", err);
      alert("Failed to update batch");
    }
  };

  // ✅ Delete batch
  const deleteBatch = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    try {
      await axios.delete(`${API_BASE}/batches/${batchId}`);
      fetchBatches(selectedClass);
      if (selectedBatch?.id === batchId) {
        setSelectedBatch(null);
        setAssignedStudents([]);
        setUnassignedStudents([]);
      }
      alert("🗑️ Batch deleted successfully");
    } catch (err) {
      console.error("Error deleting batch:", err);
    }
  };

  // ✅ Assign / Unassign student
  const assignStudent = async (studentUid) => {
    if (!selectedBatch) return alert("Select a batch first!");
    try {
      await axios.post(`${API_BASE}/batches/${selectedBatch.id}/assign`, {
        studentUid,
      });
      fetchBatchStudents(selectedBatch.id, selectedClass);
    } catch (err) {
      console.error("Error assigning student:", err);
    }
  };

  const unassignStudent = async (studentUid) => {
    if (!selectedBatch) return alert("Select a batch first!");
    try {
      await axios.post(`${API_BASE}/batches/${selectedBatch.id}/unassign`, {
        studentUid,
      });
      fetchBatchStudents(selectedBatch.id, selectedClass);
    } catch (err) {
      console.error("Error unassigning student:", err);
    }
  };

  // ✅ On batch select
  const handleBatchClick = (b) => {
    setSelectedBatch(b);
    setEditDay(b.day || "");
    setEditTime(b.time || "");
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
          {/* ✅ Batches Section */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg text-blue-700 mb-3">
              Batches for Class {selectedClass}
            </h2>

            {/* Create Batch Form */}
            <div className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                placeholder="Batch name (e.g., Alpha)"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="border p-2 rounded w-full"
              />

              {/* First Day & Time */}
              <select
                value={batchDay}
                onChange={(e) => setBatchDay(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Day *</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={batchTime}
                onChange={(e) => setBatchTime(e.target.value)}
                className="border p-2 rounded w-full"
              />

              {/* Second (Optional) */}
              <select
                value={batchDay2}
                onChange={(e) => setBatchDay2(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Second Day (Optional)</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={batchTime2}
                onChange={(e) => setBatchTime2(e.target.value)}
                className="border p-2 rounded w-full"
              />

              <button
                onClick={saveBatch}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Batch
              </button>
            </div>

            {/* Batch List */}
            <ul className="space-y-2">
              {batches.map((b) => (
                <li
                  key={b.id}
                  className={`p-3 border rounded flex flex-col gap-2 ${
                    selectedBatch?.id === b.id
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white"
                  }`}
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleBatchClick(b)}
                  >
                    <div>
                      <p className="font-semibold text-blue-700">{b.name}</p>
                      {b.day && b.time && (
                        <p className="text-sm text-gray-600">
                          🗓️ {b.day}, ⏰ {b.time}
                        </p>
                      )}
                      {b.day2 && b.time2 && (
                        <p className="text-sm text-gray-600">
                          🗓️ {b.day2}, ⏰ {b.time2}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBatch(b.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>

                  {selectedBatch?.id === b.id && (
                    <div className="flex flex-col gap-2 border-t pt-2">
                      <select
                        value={editDay}
                        onChange={(e) => setEditDay(e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="">Change Day</option>
                        {days.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>

                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="border p-1 rounded"
                      />

                      <button
                        onClick={() => updateBatch(b.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Update Day & Time
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Assigned Students */}
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

          {/* ✅ Unassigned Students */}
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
