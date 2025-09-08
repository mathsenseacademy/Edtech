import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "student_id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 10;
  const navigate = useNavigate();

  // Fetch students
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("student/student_list/");
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch courses
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("course/course_list/");
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, []);

  // Search filter
  const filteredStudents = students.filter((s) => {
    const fullName = [s.first_name, s.middle_name, s.last_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sorting
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue, bValue;

    if (sortConfig.key === "name") {
      aValue = [a.first_name, a.middle_name, a.last_name].filter(Boolean).join(" ");
      bValue = [b.first_name, b.middle_name, b.last_name].filter(Boolean).join(" ");
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  // Handle row click
  const handleRowClick = (id) => {
    navigate(`/students/edit/${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Directory</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {error && <p className="text-red-500 mb-3">{error}</p>}

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name, ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 p-2 border rounded shadow-sm"
          />

          {/* Table */}
          {currentStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => requestSort("student_id")}
                    >
                      Student ID
                    </th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      Name
                    </th>
                    <th className="px-4 py-2">Email</th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => requestSort("dob")}
                    >
                      DOB
                    </th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => requestSort("gender")}
                    >
                      Gender
                    </th>
                    <th className="px-4 py-2">Class</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Verified</th>
                    <th className="px-4 py-2">Avatar</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((s) => {
                    const course = courses.find((c) => c.course_id === s.student_class);
                    const classLabel = loadingCourses
                      ? "Loading..."
                      : course
                      ? `${course.msa_class_level} (${course.course_name})`
                      : "Unknown Class";

                    return (
                      <tr
                        key={s.student_id}
                        onClick={() => handleRowClick(s.student_id)}
                        className="hover:bg-gray-50 cursor-pointer border-t"
                      >
                        <td className="px-4 py-2">{s.student_id}</td>
                        <td className="px-4 py-2">
                          {[s.first_name, s.middle_name, s.last_name]
                            .filter(Boolean)
                            .join(" ")}
                        </td>
                        <td className="px-4 py-2">{s.email}</td>
                        <td className="px-4 py-2">{s.dob}</td>
                        <td className="px-4 py-2">{s.gender}</td>
                        <td className="px-4 py-2">{classLabel}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              s.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {s.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              s.is_verified
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {s.is_verified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <img
                            src={s.profile_picture || "https://via.placeholder.com/50"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No students found.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentList;
