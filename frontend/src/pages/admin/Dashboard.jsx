import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://api-bqojuh5xfq-uc.a.run.app/api/student";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/`);
      setStudents(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Error loading students:", err);
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Return correct photo URL
  const getStudentPhotoUrl = (student) => {
    if (!student) return "/placeholder.png";
    const p = student.student_photo_path;
    if (!p) return "/placeholder.png";
    if (typeof p === "string") return p;
    if (typeof p === "object" && p.url) return p.url;
    return "/placeholder.png";
  };

  // Filter & search
  const filteredByClass = selectedClass
    ? students.filter((s) => s.student_class === selectedClass)
    : [];

  const searchedStudents = filteredByClass.filter((s) => {
    const full = `${s.first_name} ${s.last_name}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

    const totalStudentsInClass = filteredByClass.length;

  // Mark Paid
  const markPaid = async (student) => {
    try {
      console.log("Full student object received by markPaid:", student);

      // 1️⃣ Update fees status in backend
      await axios.put(`${API_BASE}/${student.uid}/fees`, {
        status: "Yes",
      });

      // 2️⃣ Send email (no fees amount, only month info)
      const month = new Date().toLocaleString("default", { month: "long" });

      await axios.post(`${API_BASE}/send-fees-email`, {
        email: student.email,
        name: `${student.first_name} ${student.last_name}`,
        month,
      });

      alert("Fees marked as paid & email sent!");

      // 3️⃣ Refresh students list
      fetchStudents();
    } catch (err) {
      console.error("❌ Error in markPaid:", err);
      alert("Error marking fees paid.");
    }
  };

  // Reset all fees
  const resetFees = async () => {
    try {
      const ok = window.confirm("Reset all students' fees to 'No'?");

      if (!ok) return;

      await axios.post(`${API_BASE}/reset-fees`);
      alert("All student fees reset!");

      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Error resetting fees.");
    }
  };

  return (
    <div className="p-6 bg-[#fff9ed] min-h-screen">
      {/* Header + Reset Fees button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#4b2e05]">
          🎓 Admin Dashboard
        </h1>

        {selectedClass && (
          <button
            onClick={resetFees}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🔄 Reset Fees
          </button>
        )}
      </div>

      {error && (
        <p className="mb-4 text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
      )}

      {/* CLASS SELECTION */}
      {!selectedClass && (
        <div>
          <h2 className="text-xl font-semibold text-[#4b2e05] mb-4">
            Select Class
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(12)].map((_, index) => {
              const cls = index + 1;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(String(cls))}
                  className="p-4 bg-[#f6e7c1] hover:bg-[#f4d78a] text-[#4b2e05] rounded-xl shadow transition text-lg font-semibold"
                >
                  Class {cls}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STUDENTS LIST */}
      {selectedClass && (
        <div>
          <button
            onClick={() => setSelectedClass(null)}
            className="px-4 py-2 mb-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            🔙 Back to Classes
          </button>

          <h2 className="text-2xl font-bold text-[#4b2e05] mb-2">
  Students of Class {selectedClass}{" "}
  <span className="text-3xl font-bold text-amber-800">
    : {totalStudentsInClass}
  </span>
</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md mb-4 w-full max-w-md"
          />

          {loading && (
            <p className="text-gray-500 mt-4">Loading students...</p>
          )}

          {!loading && searchedStudents.length === 0 && (
            <p className="text-gray-500 mt-10">No students found.</p>
          )}

          {/* TABLE */}
          {!loading && searchedStudents.length > 0 && (
            <div className="overflow-x-auto rounded-xl border shadow bg-white">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-[#f6e7c1] text-[#4b2e05]">
                  <tr>
                    <th className="border p-3">Photo</th>
                    <th className="border p-3">Name</th>
                    <th className="border p-3">Mark Paid</th>
                  </tr>
                </thead>

                <tbody>
                  {searchedStudents.map((s) => {
                    const photo = getStudentPhotoUrl(s);
                    console.log("Sample student object:", s);

                    return (
                      <tr key={s.uid || s.id} className="hover:bg-[#fff8e1]">
                        {/* PHOTO */}
                        <td className="border p-3 text-center">
                          <img
                            src={photo}
                            alt={`${s.first_name} ${s.last_name}`}
                            className="w-14 h-14 rounded-full mx-auto border object-cover cursor-pointer"
                            onClick={() => navigate(`/admin/student/${s.uid}`)}
                          />
                        </td>

                        {/* NAME */}
                        <td
                          className="border p-3 capitalize font-medium cursor-pointer"
                          onClick={() => navigate(`/admin/student/${s.uid}`)}
                        >
                          {s.first_name} {s.last_name}
                        </td>

                        {/* FEES BUTTON */}
                        <td className="border p-3 text-center">
                          {s.fees_status === "Yes" ? (
                            <span className="text-green-700 font-semibold">
                              ✔ Paid
                            </span>
                          ) : (
                            <button
                              onClick={() => markPaid(s)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
