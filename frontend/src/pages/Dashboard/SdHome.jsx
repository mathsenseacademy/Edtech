"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const SdHome = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // Try from localStorage first
        const storedStudent = localStorage.getItem("studentData");
        if (storedStudent) {
          setStudent(JSON.parse(storedStudent));
          setLoading(false);
          return;
        }

        // If missing, fetch using studentUid
        const uid = localStorage.getItem("studentUid");
        if (!uid) {
          console.warn("No student UID found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/student/check-registration`,
          {
            params: { google_uid: uid },
          }
        );

        if (response.data.exists && response.data.student_data) {
          const studentData = response.data.student_data;
          localStorage.setItem("studentData", JSON.stringify(studentData));
          setStudent(studentData);
        } else {
          console.warn("Student not found or registration incomplete");
        }
      } catch (err) {
        console.error("Error loading student data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        Student data not found. Please login again.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {student.first_name} {student.last_name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Class: {student.student_class || "-"} | Student ID: {student.student_id}
        </p>
      </section>

      {/* Coming Soon Cards */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Coming Soon Sections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Schedule", icon: "📅" },
            { title: "Classes", icon: "📖" },
            { title: "Notes", icon: "📝" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl shadow-md bg-white flex flex-col items-center justify-center hover:shadow-xl transition-shadow"
            >
              <span className="text-4xl mb-4">{item.icon}</span>
              <h3 className="text-xl font-medium">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SdHome;
