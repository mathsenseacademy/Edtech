// src/components/ProgramsSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/our-programs-hero.png";
import api from "../api/api";

export default function ProgramsSection() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/coursemanegment/all_courses_show_public/")
      .then((res) => setPrograms(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load programs.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 bg-[#fffdf6]">Loading programs…</div>;
  if (error) return <div className="p-6 bg-[#fffdf6]">{error}</div>;

  return (
    <section className="bg-[#fffdf6] px-6 py-12 font-poppins">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-left text-[#875714] flex items-center">
        <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-[#875714] rounded-full bg-white text-[#875714] text-3xl animate-spin-slow mr-2">
          ★
        </span>
        Our Programs
      </h2>

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-6 items-center mb-10">
        <div className="flex justify-center">
          <img
            src={heroImage}
            alt="Our Program Hero"
            className="rounded-3xl p-4 w-[70%] md:w-[65%] lg:w-[70%]"
          />
        </div>

        <div className="flex flex-col">
          {programs.slice(0, 2).map((p) => (
            <div
              key={p.ID}
              onClick={() => navigate(`/courses/${p.ID}`)}
              className="relative flex items-center w-full h-[8.5rem] md:h-[10rem] lg:h-[15rem] mb-4 p-4 rounded-xl shadow hover:scale-105 transition-transform duration-200 cursor-pointer overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: `url(/src/assets/Untitled_design${
                  (p.ID % 3) + 1
                }.svg)`,
              }}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[35%] md:w-[40%] lg:w-[30%]">
                <img
                  src={p.course_image_path}
                  alt={p.course_name}
                  className="rounded-2xl object-cover w-full h-full"
                />
              </div>

              <div className="absolute right-4 w-[50%]">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
                  {p.course_name}
                </h3>
                <p className="hidden md:block text-sm font-medium">
                  {p.course_subtitle}
                </p>
                <h6 className="text-sm md:text-base lg:text-lg font-semibold">
                  {p.msa_class_level}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {programs.slice(2).map((p) => (
          <div key={p.ID}>
            <div
              onClick={() => navigate(`/courses/${p.ID}`)}
              className="relative flex items-center w-full h-[8.5rem] md:h-[10rem] lg:h-[15rem] p-4 rounded-xl shadow hover:scale-105 transition-transform duration-200 cursor-pointer overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: `url(/src/assets/Untitled_design${
                  (p.ID % 3) + 1
                }.svg)`,
              }}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[35%] md:w-[40%] lg:w-[30%]">
                <img
                  src={p.course_image_path}
                  alt={p.course_name}
                  className="rounded-2xl object-cover w-full h-full"
                />
              </div>

              <div className="absolute right-4 w-[50%]">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
                  {p.course_name}
                </h3>
                <p className="hidden md:block text-sm font-medium">
                  {p.course_subtitle}
                </p>
                <h6 className="text-sm md:text-base lg:text-lg font-semibold">
                  {p.msa_class_level}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
