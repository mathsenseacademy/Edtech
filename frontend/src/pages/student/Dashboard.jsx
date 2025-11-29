// src/pages/Dashboard/SdHome.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const API_BASE = "https://api-bqojuh5xfq-uc.a.run.app/api/student";
const BATCH_API = "https://api-bqojuh5xfq-uc.a.run.app/api/batches";

const placeholder = "/placeholder.png"; // keep this file in public or adjust path

export default function SdHome() {
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const mountedRef = useRef(true);

  // Helper to show temporary toast messages
  const showToast = (type, message, ms = 3500) => {
    setToast({ type, message });
    setTimeout(() => {
      if (mountedRef.current) setToast(null);
    }, ms);
  };

  // Helper: Convert 24-hour to 12-hour format
  const formatTime12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  // Load student profile from API
  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      const uid = localStorage.getItem("studentUid");
      if (!uid) {
        setError("You are not logged in. Please sign in to view your dashboard.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_BASE}/profile/${uid}`);
      if (!res.data) {
        setError("No student data found.");
        setLoading(false);
        return;
      }

      const studentData = res.data;
      localStorage.setItem("studentData", JSON.stringify(studentData));
      setStudent(studentData);
      setFormData(studentData);
      setError("");
    } catch (err) {
      console.error("Failed to load student profile:", err);
      setError("Failed to fetch profile. Check your connection and try again.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadStudentProfile();

    // Auto refresh (every 3 minutes)
    const interval = setInterval(loadStudentProfile, 1000 * 60 * 3);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // ✅ Enhanced batch fetch logic (with day2/time2)
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
              batches: [
                {
                  name: res.data.name,
                  day: res.data.day || "",
                  time: res.data.time || "",
                  day2: res.data.day2 || "",
                  time2: res.data.time2 || "",
                },
              ],
            }));
          }
        } catch (err) {
          console.error("Error fetching single batch:", err);
        }
        return;
      }

      // Multiple batches (array)
      if (Array.isArray(student.batches) && student.batches.length > 0) {
        const batchList = [];

        for (const b of student.batches) {
          try {
            if (typeof b === "string") {
              const res = await axios.get(`${BATCH_API}/${b}`);
              if (res.data?.name) {
                batchList.push({
                  name: res.data.name,
                  day: res.data.day || "",
                  time: res.data.time || "",
                  day2: res.data.day2 || "",
                  time2: res.data.time2 || "",
                });
              }
            } else if (b?.name) {
              batchList.push({
                ...b,
                day2: b.day2 || "",
                time2: b.time2 || "",
              });
            }
          } catch (err) {
            console.error("Error fetching batch:", err);
          }
        }

        if (batchList.length > 0) {
          setStudent((prev) => ({ ...prev, batches: batchList }));
        }
      }
    };

    fetchBatchNames();
  }, [student?.batch, student?.batches]);

  // Handle profile edits
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!student?.uid) {
      showToast("error", "Student UID missing. Please login again.");
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
        showToast("success", "Profile updated successfully.");
      } else {
        showToast("error", "Unexpected server response. Try again.");
      }
    } catch (err) {
      console.error("Error updating student:", err);
      showToast("error", "Failed to update profile. Please try later.");
    } finally {
      setUpdating(false);
    }
  };

  // Format date
  const formattedDate = student?.registered_at
    ? new Date(student.registered_at).toLocaleString()
    : "-";

  // ✅ Helper: get uploaded student photo URL (string or object)
  const getStudentPhotoUrl = (studentObj) => {
    if (!studentObj) return placeholder;

    const spp = studentObj.student_photo_path;
    if (!spp) return placeholder;

    // Old data: string URL
    if (typeof spp === "string") return spp;

    // New data: object with .url
    if (typeof spp === "object" && spp.url) return spp.url;

    return placeholder;
  };

  // Loading / Error states
  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6">
        <p className="text-gray-600">Loading your dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadStudentProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6">
        <p className="text-gray-600">Student not found. Please login again.</p>
      </main>
    );
  }

  // SEO setup
  const pageTitle = `${student.first_name || "Student"} Dashboard | MathSense Academy`;
  const pageDesc = student.notes
    ? student.notes.slice(0, 140)
    : `Dashboard for ${student.first_name || ""} ${student.last_name || ""} at MathSense Academy.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name:
      `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
      "MathSense Student",
    description: pageDesc,
    email: student.email || undefined,
  };

  return (
    <main className="p-6">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="robots" content="noindex, nofollow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 rounded-md px-4 py-3 shadow-md ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      {/* Profile Header */}
      <section className="mb-8 bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
        <div>
          <img
            src={getStudentPhotoUrl(student)}
            alt="Student"
            className="w-28 h-28 rounded-full border-4 border-blue-100 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholder;
            }}
          />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {student.first_name} {student.middle_name} {student.last_name}
          </h1>

          <div className="mt-3 text-sm text-gray-700 space-y-1">
            <p>
              <strong>Student ID:</strong> {student.student_id || "-"}
            </p>
            <p>
              <strong>Class:</strong> {student.student_class || "-"}
            </p>
            <p>
              <strong>Email:</strong> {student.email || "-"}
            </p>
          </div>

          {/* ✅ Batch + Day/Time Display */}
          <div className="mt-4 text-sm space-y-3">
            {student?.batches?.length > 0 ? (
              student.batches.map((b, i) => (
                <div key={i} className="space-y-1">
                  <p>
                    <span className="font-semibold text-gray-700">Batch:</span>{" "}
                    <span className="text-blue-700 font-semibold">{b.name}</span>
                  </p>
                  {b.day && b.time ? (
                    <p>
                      <span className="font-semibold text-gray-700">
                        Day & Time:
                      </span>{" "}
                      {b.day} – {formatTime12Hour(b.time)}
                    </p>
                  ) : null}
                  {b.day2 && b.time2 ? (
                    <p>
                      <span className="font-semibold text-gray-700">
                        2nd Day & Time:
                      </span>{" "}
                      {b.day2} – {formatTime12Hour(b.time2)}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="italic text-gray-400">Batch not assigned yet</p>
            )}
          </div>

          {/* Fees */}
          <p
            className={`mt-3 font-semibold ${
              student.feesPaid || student.fees_status === "Paid"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            💰 Fees:{" "}
            {student.fees_status || (student.feesPaid ? "Paid" : "Not Paid")}
          </p>

          <div className="mt-4">
            <button
              onClick={() => setEditing((prev) => !prev)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </section>

      {/* Editable Form */}
      {editing ? (
        <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Update Your Details
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              { name: "first_name", label: "First name" },
              { name: "middle_name", label: "Middle name" },
              { name: "last_name", label: "Last name" },
              { name: "date_of_birth", label: "Date of birth" },
              { name: "contact_number_1", label: "Contact number 1" },
              { name: "contact_number_2", label: "Contact number 2" },
              { name: "address", label: "Address" },
              { name: "city", label: "City" },
              { name: "district", label: "District" },
              { name: "state", label: "State" },
              { name: "pin", label: "PIN" },
              { name: "school_or_college_name", label: "School / College" },
              { name: "board_or_university_name", label: "Board / University" },
              { name: "notes", label: "Notes" },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="text-sm text-gray-600 mb-1 block"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            ))}
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={updating}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(student);
                  setEditing(false);
                }}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "First name", value: student.first_name },
              { label: "Middle name", value: student.middle_name },
              { label: "Last name", value: student.last_name },
              { label: "Date of birth", value: student.date_of_birth },
              { label: "Contact number 1", value: student.contact_number_1 },
              { label: "Contact number 2", value: student.contact_number_2 },
              { label: "Address", value: student.address },
              { label: "City", value: student.city },
              { label: "District", value: student.district },
              { label: "State", value: student.state },
              { label: "PIN", value: student.pin },
              {
                label: "School / College",
                value: student.school_or_college_name,
              },
              {
                label: "Board / University",
                value: student.board_or_university_name,
              },
              { label: "Notes", value: student.notes },
              { label: "Registered at", value: formattedDate },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg bg-white shadow-sm"
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
    </main>
  );
}
