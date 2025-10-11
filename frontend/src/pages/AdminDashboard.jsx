import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://mathsenseacademy.onrender.com/api/student";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // ==============================
  // Fetch all students
  // ==============================
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/`);
      const data = Array.isArray(res.data) ? res.data : [];

      if (!Array.isArray(data)) {
        console.error("Unexpected API format:", res.data);
        setError("Invalid data format received from server.");
        setStudents([]);
        return;
      }

      setStudents(data);
      setError("");
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load student data. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Toggle fees status (Yes / No)
  // ==============================
  const toggleFees = async (studentId, currentStatus) => {
    try {
      setUpdating(true);
      const newStatus = currentStatus === "Yes" ? "No" : "Yes";

      await axios.put(`${API_BASE}/${studentId}/fees`, {
        status: newStatus, // backend now accepts both `status` and `fees_status`
      });

      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, fees_status: newStatus } : s
        )
      );
    } catch (err) {
      console.error("Error updating fees:", err);
      alert("Failed to update fees. Check backend logs.");
    } finally {
      setUpdating(false);
    }
  };

  // ==============================
  // Reset all fees to "No"
  // ==============================
  const resetAllFees = async () => {
    if (!window.confirm("Are you sure you want to reset all fees to 'No'?")) return;

    try {
      setUpdating(true);
      await axios.post(`${API_BASE}/reset-fees`);
      setStudents((prev) => prev.map((s) => ({ ...s, fees_status: "No" })));
      alert("✅ All fees reset successfully!");
    } catch (err) {
      console.error("Error resetting fees:", err);
      alert("Failed to reset fees. Check backend logs.");
    } finally {
      setUpdating(false);
    }
  };

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // ==============================
  // UI Render
  // ==============================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>

      <button
        onClick={resetAllFees}
        disabled={updating}
        className={`mb-4 px-4 py-2 rounded text-white ${
          updating ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {updating ? "Processing..." : "Reset All Fees"}
      </button>

      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && students.length === 0 && (
        <p>No students found.</p>
      )}

      {!loading && !error && students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Photo</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Fees Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const {
                  id,
                  first_name,
                  last_name,
                  email,
                  student_class,
                  fees_status,
                  student_photo_path,
                  google_photo_url,
                } = student;

                const photo =
                  student_photo_path ||
                  google_photo_url ||
                  "https://via.placeholder.com/80";

                return (
                  <tr key={id}>
                    <td className="border p-2 text-center">
                      <img
                        src={photo}
                        alt={`${first_name || "Student"}'s photo`}
                        className="w-16 h-16 object-cover rounded-full mx-auto"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
                      />
                    </td>
                    <td className="border p-2 capitalize">
                      {first_name || ""} {last_name || ""}
                    </td>
                    <td className="border p-2">{email || "N/A"}</td>
                    <td className="border p-2 text-center">{student_class || "-"}</td>
                    <td
                      className={`border p-2 text-center font-semibold ${
                        fees_status === "Yes" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {fees_status || "No"}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        disabled={updating}
                        onClick={() => toggleFees(id, fees_status)}
                        className={`px-3 py-1 rounded text-white ${
                          updating
                            ? "bg-gray-400 cursor-not-allowed"
                            : fees_status === "Yes"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {updating
                          ? "Processing..."
                          : `Mark ${fees_status === "Yes" ? "Unpaid" : "Paid"}`}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
