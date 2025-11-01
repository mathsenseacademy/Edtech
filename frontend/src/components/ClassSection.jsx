import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import heroImage from "../assets/our-programs-hero.png";
import fallbackImg from "../assets/img10.png";

const API_URL = "https://mathsenseacademy.onrender.com/api/classes";

export default function ClassSection() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  // Fetch all active classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(API_URL);
        const all = res.data || [];
        // ✅ Only keep active ones
        const activeClasses = all.filter((cls) => cls.active);
        setClasses(activeClasses);
      } catch (err) {
        console.error("❌ Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  const handleCardClick = (cls) => {
    navigate(`/class/${cls.classRange}`);
  };

  return (
    <section className="bg-[#fffdf6] px-6 py-12 font-poppins">
      {/* Header */}
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-left text-[#875714] flex items-center">
        <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-[#875714] rounded-full bg-white text-[#875714] text-3xl animate-spin-slow mr-2">
          ★
        </span>
        Our Programs
      </h2>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-6 items-center mb-12">
        <div className="flex justify-center">
          <img
            src={heroImage}
            alt="Our Program Hero"
            className="rounded-3xl p-4 w-[70%] md:w-[65%] lg:w-[70%]"
          />
        </div>
        <div>
          <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed">
            Explore our thoughtfully designed programs — from Class 1 to 12.
            Each course offers a structured learning path that helps students
            build strong conceptual foundations in Mathematics and related subjects.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            No active courses available at the moment.
          </p>
        ) : (
          classes.map((cls) => (
            <div
              key={cls._id || `${cls.classRange}-${cls.title}`}
              onClick={() => handleCardClick(cls)}
              className="cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition duration-200 overflow-hidden border-2 border-green-300 bg-white"
            >
              {/* Image */}
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img
                  src={fallbackImg}
                  alt={cls.title}
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#875714] mb-2">
                  {cls.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Class:</strong> {cls.classRange}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {cls.description ||
                    `Learn essential concepts and build strong fundamentals for Class ${cls.classRange}.`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
