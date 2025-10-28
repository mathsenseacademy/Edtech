// src/components/ClassDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import fallbackImg from "../assets/img10.png";

const API_URL = "https://mathsenseacademy.onrender.com/api/classes";

export default function ClassDetails() {
  const { classNumber } = useParams();
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
    <div className="min-h-screen bg-gradient-to-br from-[#fff9f2] via-[#fffdf8] to-[#fefcf4] px-6 py-12 font-poppins">
      {/* Back button */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          to="/programs"
          className="text-[#875714] font-semibold hover:text-[#a66b1c] transition duration-150 inline-flex items-center gap-1"
        >
          ← Back to Programs
        </Link>
      </div>

      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#875714] mb-12 text-center">
        Courses for Class {classNumber}
      </h1>

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {classList.length > 0 ? (
          classList.map((cls, i) => (
            <div
              key={i}
              className={`rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 bg-white overflow-hidden transform hover:-translate-y-1 ${
                !cls.active ? "opacity-70 grayscale-[10%]" : ""
              }`}
            >
              {/* Image */}
              <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-[#fff8e7] to-[#fefbf4] flex items-center justify-center">
                <img
                  src={cls.image || fallbackImg}
                  alt={cls.title || `Class ${cls.classRange}`}
                  className="h-full w-auto object-contain hover:scale-105 transition duration-500"
                  onError={(e) => (e.target.src = fallbackImg)}
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-2xl font-semibold text-[#875714] leading-snug">
                      {cls.title || `Class ${cls.classRange}`}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        cls.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {cls.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {cls.description ||
                      "Explore engaging lessons and strengthen your foundational concepts."}
                  </p>

                  {cls.purpose && (
                    <div className="mb-3">
                      <h6 className="font-semibold text-gray-800 text-sm mb-1">
                        Purpose:
                      </h6>
                      <p className="text-gray-600 text-sm italic">
                        {cls.purpose}
                      </p>
                    </div>
                  )}

                  {cls.topics?.length > 0 && (
                    <div className="mb-3">
                      <h6 className="font-semibold text-gray-800 text-sm mb-1">
                        Topics Covered:
                      </h6>
                      <p className="text-gray-600 text-sm">
                        {cls.topics.join(", ")}
                      </p>
                    </div>
                  )}

                  {cls.suggestedBooks?.length > 0 && (
                    <div className="mt-2">
                      <h6 className="font-semibold text-gray-800 text-sm mb-1">
                        Suggested Books:
                      </h6>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        {cls.suggestedBooks.map((book, idx) => (
                          <li key={idx}>{book}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6">
                  <button
                    disabled={!cls.active}
                    className={`w-full py-2 rounded-full font-semibold transition duration-200 ${
                      cls.active
                        ? "bg-[#875714] text-white hover:bg-[#9c6c20]"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {cls.active ? "View Course Details" : "Inactive Course"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full py-20 text-lg">
            No courses found for this class.
          </p>
        )}
      </div>
    </div>
  );
}
