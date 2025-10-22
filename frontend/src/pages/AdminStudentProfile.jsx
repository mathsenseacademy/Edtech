import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://mathsenseacademy.onrender.com/api";

const AdminStudentProfile = () => {
  const { uid } = useParams();
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${API_BASE}/student/profile/${uid}`);
        setStudent(res.data);
        setFormData(res.data);
        setSelectedBatch(res.data.batch_id || "");
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    const fetchBatches = async () => {
      try {
        const res = await axios.get(`${API_BASE}/batches`);
        setBatches(res.data);
      } catch (err) {
        console.error("Error loading batches:", err);
      }
    };

    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStudent(), fetchBatches()]);
      setLoading(false);
    };

    init();
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setUpdating(true);
      await axios.put(`${API_BASE}/student/${uid}`, formData);
      alert("✅ Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("Error updating student:", err);
      alert("❌ Failed to update student");
    } finally {
      setUpdating(false);
    }
  };

  const handleBatchAssign = async () => {
    try {
      setUpdating(true);
      if (!selectedBatch) {
        alert("Please select a batch first");
        return;
      }

      await axios.post(`${API_BASE}/batches/${selectedBatch}/assign`, {
        studentUid: uid,
      });

      alert("✅ Batch assigned successfully!");
    } catch (err) {
      console.error("Error assigning batch:", err);
      alert("❌ Failed to assign batch");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading student profile...</div>;

  if (!student)
    return <div className="p-6 text-red-500">Student not found.</div>;

  // Find current batch name (if assigned)
  const assignedBatchNames =
    student.batches && student.batches.length > 0
      ? student.batches
          .map((b) => {
            const found = batches.find((x) => x.id === b || x.id === b.id);
            return found ? found.name : b.name || b;
          })
          .join(", ")
      : "Not Assigned";

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <Link
        to="/admin/dashboard"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 border-b pb-6">
          {/* Student Info */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <img
              src={
                student.google_photo_url ||
                student.student_photo_path ||
                "/placeholder.png"
              }
              alt="Student"
              className="w-32 h-32 rounded-full border-4 border-blue-300 shadow-md mb-3"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {student.first_name} {student.last_name}
            </h2>
            <p className="text-gray-500 text-sm">
              Class: {student.student_class || "N/A"}
            </p>

            {/* 👇 Added batch info display */}
            <p className="text-gray-600 text-sm mt-1">
              <strong>Batch:</strong>{" "}
              {assignedBatchNames !== "Not Assigned" ? (
                <span className="text-blue-700 font-semibold">
                  {assignedBatchNames}
                </span>
              ) : (
                <span className="italic text-gray-400">Not Assigned</span>
              )}
            </p>
          </div>

          {/* Batch Assignment */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Batch Assignment
            </h3>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            >
              <option value="">No Batch</option>
              {batches
                .filter((b) => b.class_name === student.class_name)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.class_name})
                  </option>
                ))}
            </select>
            <button
              onClick={handleBatchAssign}
              disabled={updating}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {updating ? "Updating..." : "Save Batch"}
            </button>
          </div>
        </div>

        {/* Student Details */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Student Details
          </h3>

          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData).map((field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-500 capitalize mb-1">
                    {field.replaceAll("_", " ")}
                  </label>
                  <input
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(student).map(([key, val]) => (
                <div key={key} className="border p-3 rounded bg-gray-50">
                  <p className="text-sm text-gray-500 capitalize">
                    {key.replaceAll("_", " ")}
                  </p>
                  <p className="font-medium text-gray-800">{val || "-"}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            {editing ? (
              <button
                onClick={handleSaveProfile}
                disabled={updating}
                className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentProfile;
