// src/pages/admin/AdminExamList.jsx
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/layout/AdminHeader";

// Adjust base URL when deployed
const EXAM_API_BASE = "http://localhost:5000/api";

const AdminExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterClassId, setFilterClassId] = useState("");

  const classes = [...Array(12).keys()].map((n) => n + 1);

  const fetchExams = async (classId = "") => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (classId) params.append("classId", classId);

      const url = params.toString()
        ? `${EXAM_API_BASE}/admin/exams?${params.toString()}`
        : `${EXAM_API_BASE}/admin/exams`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load exams");
      }

      setExams(data.exams || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterClassId(value);
    fetchExams(value);
  };

  const formatDateTime = (ts) => {
    if (!ts) return "-";

    // Firestore Timestamp object: { seconds, nanoseconds } or with toDate()
    if (ts.toDate) {
      return ts.toDate().toLocaleString();
    }
    if (ts._seconds) {
      return new Date(ts._seconds * 1000).toLocaleString();
    }
    // ISO string or millis
    return new Date(ts).toLocaleString();
  };

  return (
    <>
      <AdminHeader />

      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-bold">All Exams</h2>
              <p className="text-sm text-gray-600">
                List of exams created either directly from Excel or via the
                question bank.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Filter by Class:</label>
              <select
                value={filterClassId}
                onChange={handleFilterChange}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <p className="text-gray-600">Loading exams...</p>}
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          {!loading && !error && exams.length === 0 && (
            <p className="text-gray-500 text-sm">
              No exams found. Try creating one from Excel or the question bank.
            </p>
          )}

          {!loading && !error && exams.length > 0 && (
            <div className="overflow-x-auto mt-3">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 py-2 text-left">Title</th>
                    <th className="border px-3 py-2 text-left">Code</th>
                    <th className="border px-3 py-2 text-left">Class</th>
                    <th className="border px-3 py-2 text-left">Batch</th>
                    <th className="border px-3 py-2 text-left">
                      Time (min)
                    </th>
                    <th className="border px-3 py-2 text-left">
                      Topics (from bank)
                    </th>
                    <th className="border px-3 py-2 text-left">Created At</th>
                    <th className="border px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">
                        <div className="font-medium">{exam.title}</div>
                      </td>
                      <td className="border px-3 py-2">{exam.code}</td>
                      <td className="border px-3 py-2">
                        {exam.classId ? `Class ${exam.classId}` : "-"}
                      </td>
                      <td className="border px-3 py-2">
                        {exam.batchId || "ALL"}
                      </td>
                      <td className="border px-3 py-2">
                        {exam.timeLimitMinutes || "-"}
                      </td>
                      <td className="border px-3 py-2">
                        {exam.sourceTopics && exam.sourceTopics.length > 0 ? (
                          <span className="inline-flex flex-wrap gap-1">
                            {exam.sourceTopics.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs"
                              >
                                {t}
                              </span>
                            ))}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            (From Excel upload)
                          </span>
                        )}
                      </td>
                      <td className="border px-3 py-2">
                        {formatDateTime(exam.createdAt)}
                      </td>
                      <td className="border px-3 py-2">
                        {/* For now just a link; you can build attempts page later */}
                        <a
                          href={`/admin/exams/${exam.id}/attempts`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          View attempts
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminExamList;
