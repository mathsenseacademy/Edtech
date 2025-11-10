"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://api-bqojuh5xfq-uc.a.run.app/api/student";
const BATCH_API = "https://api-bqojuh5xfq-uc.a.run.app/api/batches";

const SdHome = () => {
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch student data
  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      const uid = localStorage.getItem("studentUid");
      if (!uid) {
        console.warn("⚠️ No UID found, student not logged in");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_BASE}/profile/${uid}`);
      if (!res.data) {
        setError("No student record found.");
        return;
      }

      const studentData = res.data;
      localStorage.setItem("studentData", JSON.stringify(studentData));
      setStudent(studentData);
      setFormData(studentData);
      setError("");
    } catch (err) {
      console.error("Error loading student profile:", err);
      setError("Failed to fetch student data. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentProfile();

    // Auto-refresh every 3 minutes
    const interval = setInterval(() => {
      loadStudentProfile();
    }, 60000 * 3);

    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch batch names if only IDs are stored
  useEffect(() => {
    const fetchBatchNames = async () => {
      if (!student) return;

      // Single batch ID
      if (student.batch && typeof student.batch === "string") {
        try {
          const res = await axios.get(`${BATCH_API}/${student.batch}`);
          if (res.data?.name) {
            setStudent((prev) => ({
              ...prev,
              batches: [{ name: res.data.name }],
            }));
          }
        } catch (err) {
          console.error("Error fetching batch:", err);
        }
        return;
      }

      // Multiple batch IDs
      if (Array.isArray(student.batches) && student.batches.length > 0) {
        const batchNames = [];
        for (const b of student.batches) {
          if (typeof b === "string") {
            try {
              const res = await axios.get(`${BATCH_API}/${b}`);
              if (res.data?.name) batchNames.push({ name: res.data.name });
            } catch (err) {
              console.error("Error fetching batch:", err);
            }
          } else if (b?.name) {
            batchNames.push(b);
          }
        }

        if (batchNames.length > 0) {
          setStudent((prev) => ({ ...prev, batches: batchNames }));
        }
      }
    };

    fetchBatchNames();
  }, [student?.batch, student?.batches]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!student?.uid) {
      alert("Student UID missing. Please re-login.");
      return;
    }

    try {
      setUpdating(true);
      const res = await axios.put(`${API_BASE}/${student.uid}`, formData);

      if (res.data?.student) {
        localStorage.setItem("studentData", JSON.stringify(res.data.student));
        setStudent(res.data.student);
        setFormData(res.data.student);
        setEditing(false);
        alert("✅ Profile updated successfully!");
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error updating student:", err);
      alert("❌ Failed to update profile. Please try again later.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading your dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        {error}
      </div>
    );

  if (!student)
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        Student not found. Please login again.
      </div>
    );

  const formattedDate = student.registered_at
    ? new Date(student.registered_at).toLocaleString()
    : "-";

  // ✅ Display batch names properly
  let displayBatch = "Not assigned yet";
  if (student.batches && Array.isArray(student.batches) && student.batches.length > 0) {
    displayBatch = student.batches.map((b) => b.name || b).join(", ");
  } else if (student.batch && student.batch.trim() !== "") {
    displayBatch = student.batch;
  }

  return (
    <div className="p-6">
      {/* Profile Header */}
      <section className="mb-10 bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={
            student.google_photo_url ||
            student.student_photo_path ||
            "/placeholder.png"
          }
          alt="Student"
          className="w-32 h-32 rounded-full border-4 border-blue-300 shadow object-cover"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {student.first_name || ""} {student.middle_name || ""}{" "}
            {student.last_name || ""}
          </h1>
          <p className="text-gray-600 mt-2">
            <strong>Student ID:</strong> {student.student_id || "-"}
          </p>
          <p className="text-gray-600">
            <strong>Class:</strong> {student.student_class || "-"}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {student.email || "-"}
          </p>

          <p className="text-gray-600">
            <strong>Batch:</strong>{" "}
            {displayBatch === "Not assigned yet" ? (
              <span className="italic text-gray-400">{displayBatch}</span>
            ) : (
              <span className="text-blue-700 font-semibold">
                {displayBatch}
              </span>
            )}
          </p>

          <p
            className={`mt-2 font-semibold ${
              student.feesPaid || student.fees_status === "Paid"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            💰 Fees Status:{" "}
            {student.fees_status || (student.feesPaid ? "Paid" : "Not Paid")}
          </p>

          <button
            onClick={() => setEditing((prev) => !prev)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </section>

      {/* Editable Section */}
      {editing ? (
        <section className="mb-10 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Update Your Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "first_name",
              "middle_name",
              "last_name",
              "date_of_birth",
              "contact_number_1",
              "contact_number_2",
              "address",
              "city",
              "district",
              "state",
              "pin",
              "school_or_college_name",
              "board_or_university_name",
              "notes",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-600 capitalize mb-1">
                  {field.replaceAll("_", " ")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={updating}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </section>
      ) : (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "First Name", value: student.first_name },
              { label: "Middle Name", value: student.middle_name },
              { label: "Last Name", value: student.last_name },
              { label: "Date of Birth", value: student.date_of_birth },
              { label: "Contact Number 1", value: student.contact_number_1 },
              { label: "Contact Number 2", value: student.contact_number_2 },
              { label: "Address", value: student.address },
              { label: "City", value: student.city },
              { label: "District", value: student.district },
              { label: "State", value: student.state },
              { label: "PIN", value: student.pin },
              {
                label: "School/College",
                value: student.school_or_college_name,
              },
              {
                label: "Board/University",
                value: student.board_or_university_name,
              },
              { label: "Notes", value: student.notes },
              { label: "Batch", value: displayBatch },
              { label: "Registered At", value: formattedDate },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-lg font-medium text-gray-800">
                  {item.value || "-"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SdHome;
