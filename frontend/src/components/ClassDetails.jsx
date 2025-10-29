// src/components/ClassDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import fallbackImg from "../assets/img10.png";
import { useNavigate } from "react-router-dom";

const API_URL = "https://mathsenseacademy.onrender.com/api/classes";

export default function ClassDetails() {
  const { classNumber } = useParams();
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(API_URL);
        const filtered = res.data.filter(
          (cls) => String(cls.classRange) === String(classNumber)
        );
        setClassList(filtered);
      } catch (err) {
        console.error("Error fetching class details:", err);
        setError("Failed to load class details.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [classNumber]);

  if (loading)
    return (
      <div className="text-center py-20 text-lg text-gray-500 animate-pulse">
        Loading class details...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf3] via-[#fffdf9] to-[#fff9f1] px-6 py-12 font-poppins">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto mb-10">
        <Link
          to="/programs"
          className="text-[#875714] font-semibold hover:text-[#a66b1c] transition duration-150 inline-flex items-center gap-1"
        >
          ← Back to Programs
        </Link>
      </div>

      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#875714] mb-16 text-center">
        Courses for Class {classNumber}
      </h1>

      {/* Each Class Full Page Style */}
        {classList.length > 0 ? (
          classList.map((cls, i) => (
            <div
              key={i}
              className="rounded-3xl shadow-xl border border-gray-200 bg-white overflow-hidden transition duration-300"
            >
              {/* Top Banner */}
              <div className="w-full bg-gradient-to-r from-[#fff6e6] to-[#fffaf3] p-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-3">
                  <h2 className="text-3xl font-bold text-[#875714]">
                    {cls.title || `Class ${cls.classRange}`}
                  </h2>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        cls.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {cls.active ? "Active" : "Inactive"}
                    </span>

                    <span className="text-sm text-gray-600 italic">
                      Course Range: {cls.classRange}
                    </span>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 md:ml-8">
                  <img
                    src={cls.image || fallbackImg}
                    alt={cls.title || `Class ${cls.classRange}`}
                    className="h-48 w-auto object-contain mx-auto rounded-xl shadow-md bg-white p-2"
                    onError={(e) => (e.target.src = fallbackImg)}
                  />
                </div>
              </div>

              {/* Body Content */}
              <div className="p-8 space-y-8 text-gray-700">
                {/* Description */}
                {cls.description && (
                  <section>
                    <h3 className="text-xl font-semibold text-[#875714] mb-2">
                      Description
                    </h3>
                    <p className="leading-relaxed">{cls.description}</p>
                  </section>
                )}

                {/* Purpose */}
                {cls.purpose && (
                  <section>
                    <h3 className="text-xl font-semibold text-[#875714] mb-2">
                      Purpose
                    </h3>
                    <p className="italic">{cls.purpose}</p>
                  </section>
                )}

                {/* Topics */}
                {cls.topics?.length > 0 && (
                  <section>
                    <h3 className="text-xl font-semibold text-[#875714] mb-2">
                      Topics Covered
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {cls.topics.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Suggested Books */}
                {cls.suggestedBooks?.length > 0 && (
                  <section>
                    <h3 className="text-xl font-semibold text-[#875714] mb-2">
                      Suggested Books
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {cls.suggestedBooks.map((book, idx) => (
                        <li key={idx}>{book}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Footer */}
                <div className="pt-6">
  <button
    onClick={() => cls.active && navigate("/login/student")}
    disabled={!cls.active}
    className={`w-full md:w-auto px-8 py-3 rounded-full font-semibold transition duration-200 ${
      cls.active
        ? "bg-[#875714] text-white hover:bg-[#9c6c20]"
        : "bg-gray-300 text-gray-600 cursor-not-allowed"
    }`}
  >
    {cls.active ? "Enroll Now" : "Inactive Course"}
  </button>
</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-20 text-lg">
            No courses found for this class.
          </p>
        )}
      </div>
  );
}
