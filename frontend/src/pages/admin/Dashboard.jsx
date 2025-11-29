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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/`);
      const data = Array.isArray(res.data) ? res.data : [];
      setStudents(data);
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

  // Helper: get uploaded student photo URL (string or object)
  const getStudentPhotoUrl = (student) => {
    if (!student) return "/placeholder.png";

    const spp = student.student_photo_path;
    if (!spp) return "/placeholder.png";

    // Old: string URL
    if (typeof spp === "string") return spp;

    // New: object with .url
    if (typeof spp === "object" && spp.url) return spp.url;

    return "/placeholder.png";
  };

  // Filter by selected class
  const filteredByClass = selectedClass
    ? students.filter((s) => s.student_class === selectedClass)
    : [];

  // Search inside the class students
  const searchedStudents = filteredByClass.filter((s) => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const goToStudentProfile = (uid) => {
    navigate(`/admin/student/${uid}`);
  };

  return (
    <div className="p-6 bg-[#fff9ed] min-h-screen">
      <h1 className="text-3xl font-bold text-[#4b2e05] mb-6">
        🎓 Admin Dashboard
      </h1>

      {error && (
        <p className="mb-4 text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
      )}

      {/* ==============================
          PART 1 → Class List View
      =============================== */}
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

      {/* ==============================
          PART 2 → Students List View
      =============================== */}
      {selectedClass && (
        <div>
          {/* Back button */}
          <button
            onClick={() => setSelectedClass(null)}
            className="px-4 py-2 mb-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            🔙 Back to Classes
          </button>

          {/* Class heading */}
          <h2 className="text-2xl font-bold text-[#4b2e05] mb-4">
            Students of Class {selectedClass}
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

          {/* Students Table */}
          {!loading && searchedStudents.length > 0 && (
            <div className="overflow-x-auto rounded-xl border shadow bg-white">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-[#f6e7c1] text-[#4b2e05]">
                  <tr>
                    <th className="border p-3">Photo</th>
                    <th className="border p-3">Name</th>
                    <th className="border p-3">Class</th>
                    <th className="border p-3">Fees</th>
                  </tr>
                </thead>

                <tbody>
                  {searchedStudents.map((s) => {
                    const photo = getStudentPhotoUrl(s);

                    return (
                      <tr
                        key={s.uid || s.id}
                        className="hover:bg-[#fff8e1] cursor-pointer"
                        onClick={() => goToStudentProfile(s.uid)}
                      >
                        <td className="border p-3 text-center">
                          <img
                            src={photo}
                            alt={`${s.first_name} ${s.last_name}`}
                            className="w-14 h-14 rounded-full mx-auto border object-cover"
                          />
                        </td>

                        <td className="border p-3 capitalize font-medium">
                          {s.first_name} {s.last_name}
                        </td>

                        <td className="border p-3 text-center">
                          {s.student_class}
                        </td>

                        <td
                          className={`border p-3 text-center font-semibold ${
                            s.fees_status === "Yes"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {s.fees_status}
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
