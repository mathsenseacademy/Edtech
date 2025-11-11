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

  // Helper to show temporary toast messages (success/error)
  const showToast = (type, message, ms = 3500) => {
    setToast({ type, message });
    setTimeout(() => {
      if (mountedRef.current) setToast(null);
    }, ms);
  };

  // Load student profile from API
  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      const uid = localStorage.getItem("studentUid");
      if (!uid) {
        console.warn("No student UID found in localStorage");
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

    // Auto refresh (3 minutes)
    const interval = setInterval(() => {
      loadStudentProfile();
    }, 1000 * 60 * 3);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If API stores batch ids, resolve names
  useEffect(() => {
    const fetchBatchNames = async () => {
      if (!student) return;

      // single batch id in `batch`
      if (student.batch && typeof student.batch === "string") {
        try {
          const res = await axios.get(`${BATCH_API}/${student.batch}`);
          if (res.data?.name) {
            setStudent((prev) => ({ ...prev, batches: [{ name: res.data.name }] }));
          }
        } catch (err) {
          console.error("Error fetching single batch:", err);
        }
        return;
      }

      // array of batch IDs/objects in `batches`
      if (Array.isArray(student.batches) && student.batches.length > 0) {
        const batchNames = [];
        for (const b of student.batches) {
          try {
            if (typeof b === "string") {
              const res = await axios.get(`${BATCH_API}/${b}`);
              if (res.data?.name) batchNames.push({ name: res.data.name });
            } else if (b?.name) {
              batchNames.push(b);
            }
          } catch (err) {
            console.error("Error fetching batch in list:", err);
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

  // formatted values for display
  const formattedDate = student?.registered_at
    ? new Date(student.registered_at).toLocaleString()
    : "-";

  let displayBatch = "Not assigned yet";
  if (student?.batches && Array.isArray(student.batches) && student.batches.length > 0) {
    displayBatch = student.batches.map((b) => b.name || b).join(", ");
  } else if (student?.batch && String(student.batch).trim() !== "") {
    displayBatch = student.batch;
  }

  // Loading / Error states
  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadStudentProfile}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
        <div className="text-center">
          <p className="text-gray-600">Student not found. Please login again.</p>
        </div>
      </main>
    );
  }

  // Dynamic SEO meta (Helmet)
  const pageTitle = `${student.first_name || "Student"} Dashboard | MathSense Academy`;
  const pageDesc = student.notes
    ? student.notes.slice(0, 140)
    : `Dashboard for ${student.first_name || ""} ${student.last_name || ""} at MathSense Academy. View enrolment, batch, and profile details.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${student.first_name || ""} ${student.last_name || ""}`.trim() || "MathSense Student",
    description: pageDesc,
    email: student.email || undefined,
  };

  return (
    <main className="p-6">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="robots" content="noindex, nofollow" />
        {/* Note: student dashboard is typically private - default to noindex. Remove if you want indexing. */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-6 top-6 z-50 rounded-md px-4 py-3 shadow-md ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Profile Header */}
      <section
        aria-labelledby="profile-heading"
        className="mb-8 bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center"
      >
        <div className="flex items-center gap-4">
          <img
            src={
              // student.google_photo_url ||
              student.student_photo_path ||
              placeholder
            }
            alt={`${student.first_name || "Student"} profile photo`}
            className="w-28 h-28 rounded-full border-4 border-blue-100 object-cover"
            onError={(e) => (e.target.src = placeholder)}
          />
        </div>

        <div>
          <h1 id="profile-heading" className="text-2xl md:text-3xl font-bold text-gray-800">
            {student.first_name || ""} {student.middle_name || ""} {student.last_name || ""}
          </h1>

          <div className="mt-3 flex flex-wrap gap-4 items-center">
            <p className="text-sm text-gray-600">
              <strong>Student ID:</strong> {student.student_id || "-"}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Class:</strong> {student.student_class || "-"}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {student.email || "-"}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <p className="text-gray-600">
              <strong>Batch:</strong>{" "}
              {displayBatch === "Not assigned yet" ? (
                <span className="italic text-gray-400">{displayBatch}</span>
              ) : (
                <span className="text-blue-700 font-semibold">{displayBatch}</span>
              )}
            </p>

            <p
              className={`font-semibold ${
                student.feesPaid || student.fees_status === "Paid"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              💰 Fees: {student.fees_status || (student.feesPaid ? "Paid" : "Not Paid")}
            </p>

            {/* <p className="text-gray-500">
              <strong>Registered:</strong> {formattedDate}
            </p> */}
          </div>

          <div className="mt-4">
            <button
              onClick={() => setEditing((prev) => !prev)}
              aria-pressed={editing}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </section>

      {/* Editable Form */}
      {editing ? (
        <section
          aria-labelledby="edit-heading"
          className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner"
        >
          <h2 id="edit-heading" className="text-xl font-semibold text-gray-800 mb-4">
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
              { name: "school_or_college_name", label: "School / college" },
              { name: "board_or_university_name", label: "Board / university" },
              { name: "notes", label: "Notes" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label htmlFor={field.name} className="text-sm text-gray-600 mb-1">
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
        <section aria-labelledby="details-heading" className="mb-8">
          <h2 id="details-heading" className="text-xl font-semibold text-gray-800 mb-4">
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
              { label: "School / College", value: student.school_or_college_name },
              { label: "Board / University", value: student.board_or_university_name },
              { label: "Notes", value: student.notes },
              { label: "Batch", value: displayBatch },
              { label: "Registered at", value: formattedDate },
            ].map((item, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-white shadow-sm">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-lg font-medium text-gray-800">{item.value || "-"}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
