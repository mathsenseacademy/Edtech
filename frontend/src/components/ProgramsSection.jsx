// src/components/ProgramsSection.jsx
import React from "react";
import heroImage from "../assets/our-programs-hero.png";
import img8 from "../assets/img8.png";
import img9 from "../assets/img9.png";
import img10 from "../assets/img10.png";

// Example static data
const programs = [
  {
    id: 1,
    name: "Mathematics Foundation",
    subtitle: "Strong basics, strong future",
    level: "Class 8",
    image: img8,
    schedule: ["Coming Soon"],
    notes: ["Algebra basics", "Geometry introduction", "Weekly assignments"],
    batches: ["Batch A", "Batch B"],
  },
  {
    id: 2,
    name: "Science Explorer",
    subtitle: "Hands-on science learning",
    level: "Class 9",
    image: img9,
    schedule: ["Coming Soon"],
    notes: ["Live Classes", "Career Discussion", "MCQ practice"],
    batches: ["Batch X", "Batch Y"],
  },
  {
    id: 3,
    name: "Competitive Prep",
    subtitle: "Focus on exams",
    level: "Class 10",
    image: img10,
    schedule: ["Coming Soon"],
    notes: ["Mock tests", "Exam strategy sessions", "Doubt solving"],
    batches: ["Morning Batch", "Evening Batch"],
  },
];

export default function ProgramsSection() {
  return (
    <section className="bg-[#fffdf6] px-6 py-12 font-poppins">
      {/* Header */}
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-left text-[#875714] flex items-center">
        <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-[#875714] rounded-full bg-white text-[#875714] text-3xl animate-spin-slow mr-2">
          ★
        </span>
        Our Programs
      </h2>

      {/* Hero */}
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
            Explore our thoughtfully designed programs, complete with class
            schedules, batch details, and structured notes to ensure your
            learning journey is smooth and effective.
          </p>
        </div>
      </div>

      {/* Program Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden"
          >
            {/* Image */}
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-auto object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#875714]">{p.name}</h3>
              <p className="text-gray-600 mb-2">{p.subtitle}</p>
              <h6 className="text-sm md:text-base font-semibold text-gray-800 mb-4">
                Level: {p.level}
              </h6>

              {/* Schedule */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-[#875714]">
                  Schedule
                </h4>
                <ul className="text-sm text-gray-700 list-disc ml-5">
                  {p.schedule.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-[#875714]">Notes</h4>
                <ul className="text-sm text-gray-700 list-disc ml-5">
                  {p.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>

              {/* Batches */}
              <div>
                <h4 className="text-lg font-semibold text-[#875714]">
                  Batches
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {p.batches.map((b, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm bg-[#fff4e2] text-[#875714] rounded-full"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
