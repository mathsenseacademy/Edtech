import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://mathsenseacademy.onrender.com/api/student";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

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
        status: newStatus,
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const goToStudentProfile = (studentUid) => {
    navigate(`/admin/student/${studentUid}`);
  };

  // ==============================
  // UI Render
  // ==============================
  return (
    <div className="p-6 bg-gradient-to-b from-[#fdf8ee] to-[#fff] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#4b2e05]">🎓 Admin Dashboard</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={resetAllFees}
          disabled={updating}
          className={`px-4 py-2 rounded-md text-white transition ${
            updating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {updating ? "Processing..." : "Reset All Fees"}
        </button>

        <p className="text-gray-600 text-sm">
          Total Students: <span className="font-semibold">{students.length}</span>
        </p>
      </div>

      {loading && (
        <div className="text-center py-20 text-lg text-gray-500 animate-pulse">
          Loading student records...
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && students.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-[#f6e7c1] text-[#4b2e05]">
              <tr>
                <th className="border p-3">Photo</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Class</th>
                <th className="border p-3">Fees Status</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const {
                  uid,
                  id,
                  first_name,
                  last_name,
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
                  <tr
                    key={id}
                    className="hover:bg-[#fff8e1] transition cursor-pointer"
                  >
                    <td
                      onClick={() => goToStudentProfile(uid)}
                      className="border p-3 text-center"
                    >
                      <img
                        src={photo}
                        alt={`${first_name || "Student"}'s photo`}
                        className="w-14 h-14 object-cover rounded-full mx-auto border-2 border-[#e4c17d] hover:scale-105 transition-transform"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/80")
                        }
                      />
                    </td>

                    <td
                      onClick={() => goToStudentProfile(uid)}
                      className="border p-3 capitalize hover:text-[#875714] font-medium"
                    >
                      {first_name || ""} {last_name || ""}
                    </td>

                    <td
                      onClick={() => goToStudentProfile(uid)}
                      className="border p-3 text-center text-gray-700"
                    >
                      {student_class || "-"}
                    </td>

                    <td
                      className={`border p-3 text-center font-semibold ${
                        fees_status === "Yes"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {fees_status || "No"}
                    </td>

                    <td className="border p-3 text-center">
                      <button
                        disabled={updating}
                        onClick={() => toggleFees(id, fees_status)}
                        className={`px-3 py-1 rounded-md text-white transition ${
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
