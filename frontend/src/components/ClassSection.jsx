import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import heroImage from "../assets/our-programs-hero.png";
import fallbackImg from "../assets/img10.png";

const API_URL = "https://mathsenseacademy.onrender.com/api/classes";

export default function ClassSection() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(API_URL);
        setClasses(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // Static class groups
  const classGroups = [
    { range: "1-2" },
    { range: "3-4" },
    ...Array.from({ length: 8 }, (_, i) => ({ range: `${i + 5}` })),
  ];

  const handleCardClick = (range) => {
    navigate(`/class/${range}`);
  };

  const findClassInfo = (range) =>
    classes.find((cls) => cls.classRange === range);

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
            Each group covers structured lessons, clear learning paths, and
            builds conceptual strength step by step.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classGroups.map(({ range }) => {
          const cls = findClassInfo(range);
          const isActive = cls?.active ?? false;
          const title = cls?.title || `Class ${range}`;

          return (
            <div
              key={range}
              onClick={() => handleCardClick(range)}
              className={`cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition duration-200 overflow-hidden border-2 ${
                isActive
                  ? "border-green-300 bg-white"
                  : "border-gray-200 bg-gray-100 opacity-80"
              }`}
            >
              {/* Image */}
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img
                  src={fallbackImg}
                  alt={`Class ${range}`}
                  className="h-full w-auto object-contain"
                />
              </div>
              

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold text-[#875714]">
                    {title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {cls?.description
                    ? cls.description
                    : `Learn essential concepts and build strong fundamentals for Class ${range}.`}
                </p>
                {cls?.topics?.length > 0 && (
                  <div className="mt-3">
                    <h6 className="font-semibold text-gray-800 text-sm mb-1">
                      Topics Covered:
                    </h6>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {cls.topics.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
