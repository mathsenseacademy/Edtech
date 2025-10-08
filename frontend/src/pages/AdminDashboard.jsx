// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Protect route
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/"); // redirect to home if not admin
      return;
    }

    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentList = querySnapshot.docs.map((doc) => doc.data());
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [navigate]);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading student data...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">🎓 Admin Dashboard</h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600">No student records found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Photo</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Class</th>
                <th className="px-4 py-2 border">School/College</th>
                <th className="px-4 py-2 border">District</th>
                <th className="px-4 py-2 border">State</th>
                <th className="px-4 py-2 border">Verified</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="text-center hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <img
                      src={student.google_photo_url || student.student_photo_path}
                      alt="Profile"
                      className="w-10 h-10 rounded-full mx-auto object-cover"
                    />
                  </td>
                  <td className="border px-4 py-2">{student.first_name} {student.last_name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">{student.student_class}</td>
                  <td className="border px-4 py-2">{student.school_or_college_name}</td>
                  <td className="border px-4 py-2">{student.district}</td>
                  <td className="border px-4 py-2">{student.state}</td>
                  <td className="border px-4 py-2">
                    {student.is_verified ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
