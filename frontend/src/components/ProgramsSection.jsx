import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/our-programs-hero.png";
import fallbackImg from "../assets/img10.png";

export default function ProgramsSection() {
  const navigate = useNavigate();

  // Generate static classes 1–12
  const allClasses = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleCardClick = (classNumber) => {
    navigate(`/programs/class/${classNumber}`);
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
            Explore our thoughtfully designed programs from Class 1 to 12.
            Each class offers structured lessons, practical examples, and clear learning paths.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allClasses.map((num) => (
          <div
            key={num}
            onClick={() => handleCardClick(num)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-200 overflow-hidden"
          >
            {/* Image */}
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              <img
                src={fallbackImg}
                alt={`Class ${num}`}
                className="h-full w-auto object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#875714]">
                Class {num}
              </h3>
              <p className="text-gray-600 mb-2">
                Learn essential concepts and build strong fundamentals for Class {num}.
              </p>
              <h6 className="text-sm md:text-base font-semibold text-gray-800">
                Level: Class {num}
              </h6>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
