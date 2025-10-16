// src/components/ClassDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import fallbackImg from "../assets/img10.png";

export default function ClassDetails() {
  const { classNumber } = useParams();
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get("https://mathsenseacademy.onrender.com/api/classes");
        const filtered = res.data.filter(
          (c) => String(c.classNumber) === String(classNumber)
        );
        setClassList(filtered);
      } catch (err) {
        console.error("Error fetching class details:", err);
        setError("Failed to load class details.");
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [classNumber]);

  if (loading)
    return (
      <div className="text-center py-20 text-lg text-gray-500">
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
    <div className="bg-gradient-to-b from-[#fffdf6] to-[#fff7e6] min-h-screen px-6 py-12 font-poppins">
      <Link
        to="/programs"
        className="text-[#875714] font-semibold hover:underline mb-6 inline-block"
      >
        ← Back to Programs
      </Link>

      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#875714] mb-3">
          Class {classNumber}
        </h1>
        <p className="text-gray-600 text-lg">
          Explore all available modules, topics, and lessons for this class.
        </p>
      </div>

      {/* --- Multiple Cards if Multiple Entries --- */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {classList.length > 0 ? (
          classList.map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#f0b429]/40 hover:shadow-xl transition-all"
            >
              <div className="bg-[#fff4d6] flex items-center justify-center p-8">
                <img
                  src={cls.image || fallbackImg}
                  alt={cls.title || `Class ${classNumber}`}
                  className="w-52 h-52 object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => (e.target.src = fallbackImg)}
                />
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#875714] mb-3">
                  {cls.title || `Subject ${i + 1}`}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {cls.description ||
                    "Comprehensive lessons and exercises designed to strengthen your conceptual clarity and problem-solving skills."}
                </p>

                <div className="bg-[#fffaf0] border-l-4 border-[#f0b429] p-3 rounded-xl text-sm italic text-[#875714]">
                  “Mathematics is not about numbers, equations, or algorithms: it’s about understanding.”
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-600 col-span-full py-20 text-lg">
            No modules found for this class yet.
          </div>
        )}
      </div>

      {/* --- Topics Section --- */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-[#875714] mb-6 border-b-2 border-[#f0b429] inline-block">
          📘 Key Topics Covered
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Number Systems",
            "Algebraic Expressions",
            "Geometry & Shapes",
            "Mensuration & Area",
            "Trigonometry Essentials",
            "Data & Statistics",
          ].map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 border-l-4 border-[#f0b429]"
            >
              <h3 className="text-lg font-semibold text-[#875714]">{topic}</h3>
              <p className="text-gray-600 text-sm mt-2">
                Deep dive into {topic.toLowerCase()} with real-world examples and interactive problems.
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- Fun Facts / Insights --- */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-[#875714] mb-6 border-b-2 border-[#f0b429] inline-block">
          💡 Did You Know?
        </h2>
        <div className="bg-[#fffaf0] rounded-3xl p-6 text-[#875714] text-lg shadow-inner border border-[#f0b429]/30">
          <ul className="space-y-3 list-disc pl-6">
            <li>Mathematics helps develop critical thinking and analytical skills.</li>
            <li>Patterns and logic from math influence architecture, music, and art.</li>
            <li>Even nature follows mathematical principles — like Fibonacci sequences!</li>
          </ul>
        </div>
      </div>

      {/* --- Recommended Books --- */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-[#875714] mb-6 border-b-2 border-[#f0b429] inline-block">
          📚 Recommended Books
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "NCERT Mathematics", author: "National Council of Educational Research" },
            { name: "RS Aggarwal Mathematics", author: "R.S. Aggarwal" },
            { name: "RD Sharma Mathematics", author: "R.D. Sharma" },
          ].map((book, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-[#fffaf0] border border-[#f0b429]/50 rounded-2xl p-5 hover:bg-[#fff4d6] transition shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[#875714]">{book.name}</h3>
              <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- Inspirational Banner --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-6xl mx-auto mt-20 text-center bg-gradient-to-r from-[#f0b429] to-[#875714] text-white py-12 px-6 rounded-3xl shadow-lg"
      >
        <h2 className="text-2xl md:text-3xl font-semibold italic mb-2">
          “Mathematics gives us hope that every problem has a solution.”
        </h2>
        <p className="text-sm md:text-base opacity-90">— Anonymous</p>
      </motion.div>
    </div>
  );
}
