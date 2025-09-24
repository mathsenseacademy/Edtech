"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const SdHome = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // Load from localStorage first
        const storedStudent = localStorage.getItem("studentData");
        if (storedStudent) {
          const parsed = JSON.parse(storedStudent);
          console.log("Loaded student from localStorage:", parsed);
          setStudent(parsed);
          setLoading(false);
          return;
        }

        // Fetch from API if missing
        const uid = localStorage.getItem("studentUid");
        if (!uid) {
          console.warn("No student UID found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://mathsenseacademy.onrender.com/api/student/check-registration",
          { params: { google_uid: uid } }
        );

        console.log("API response:", response.data);

        const studentData = response.data?.student_data;
        if (!studentData) {
          console.warn("Student data missing from API response");
          setLoading(false);
          return;
        }

        // Normalize fields with defaults
        const normalizedStudent = {
          first_name: studentData.first_name || "-",
          middle_name: studentData.middle_name || "",
          last_name: studentData.last_name || "-",
          date_of_birth: studentData.date_of_birth || "-",
          contact_number_1: studentData.contact_number_1 || "-",
          contact_number_2: studentData.contact_number_2 || "-",
          student_class: studentData.student_class || "-",
          school_or_college_name: studentData.school_or_college_name || "-",
          board_or_university_name: studentData.board_or_university_name || "-",
          address: studentData.address || "-",
          city: studentData.city || "-",
          district: studentData.district || "-",
          state: studentData.state || "-",
          pin: studentData.pin || "-",
          notes: studentData.notes || "",
          email: studentData.email || "-",
          google_uid: studentData.google_uid || "-",
          google_photo_url: studentData.google_photo_url || "",
          student_photo_path: studentData.student_photo_path || "",
          student_id: studentData.student_id || "-",
          registered_at: studentData.registered_at || null,
        };

        console.log("Normalized student data:", normalizedStudent);

        localStorage.setItem("studentData", JSON.stringify(normalizedStudent));
        setStudent(normalizedStudent);
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

  // Safe date formatting
  const formattedDate = student.registered_at
    ? new Date(student.registered_at).toLocaleString()
    : "-";

  return (
    <div className="p-6">
      {/* Profile Section */}
      <section className="mb-10 bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={student.google_photo_url || student.student_photo_path || "/placeholder.png"}
          alt="Student"
          className="w-32 h-32 rounded-full border shadow object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {student.first_name} {student.middle_name} {student.last_name}
          </h1>
          <p className="text-gray-600 mt-2">
            <strong>Student ID:</strong> {student.student_id}
          </p>
          <p className="text-gray-600">
            <strong>Class:</strong> {student.student_class}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {student.email}
          </p>
        </div>
      </section>

      {/* Details Grid */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Date of Birth", value: student.date_of_birth },
            { label: "Contact Number 1", value: student.contact_number_1 },
            { label: "Contact Number 2", value: student.contact_number_2 },
            { label: "Address", value: student.address },
            { label: "City", value: student.city },
            { label: "District", value: student.district },
            { label: "State", value: student.state },
            { label: "PIN", value: student.pin },
            { label: "School/College", value: student.school_or_college_name },
            { label: "Board/University", value: student.board_or_university_name },
            { label: "Registered At", value: formattedDate },
          ].map((item, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-lg font-medium text-gray-800">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Cards */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Coming Soon Sections</h2>
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
