// src/components/Hero.jsx
import React from "react";
import heroImage from "../assets/hero-1.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const handleRegisterClick = () => {
    window.location.href = "https://mathsenseacademy.com/login/student";
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 font-poppins py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 flex flex-col md:flex-row items-center gap-14">

        {/* ============== LEFT CONTENT ============== */}
        <div className="flex-1 text-center md:text-left animate-fadeInUp">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight drop-shadow-sm">
            Unlock Your Child’s{" "}
            <span className="text-amber-600">Math Potential</span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-blue-800 max-w-xl mx-auto md:mx-0 opacity-90">
            Fun, engaging, and expert-led math programs designed to build
            confidence, curiosity, and long-term analytical skills.
          </p>

          <button
            onClick={handleRegisterClick}
            className="
              mt-8 bg-amber-500 hover:bg-amber-600 text-white 
              font-semibold text-lg px-10 py-4 rounded-full 
              shadow-xl hover:shadow-2xl transition-all duration-300 
              hover:scale-105 border-2 border-white
            "
          >
            🚀 Register Student
          </button>
        </div>

        {/* ============== RIGHT IMAGE ============== */}
        <div className="flex-1 relative flex justify-center animate-fadeInUp md:animate-fadeInRight">
          <div className="w-[85%] md:w-[80%] lg:w-[70%] rounded-[40px_0_40px_0] border-4 border-white shadow-2xl overflow-hidden">
            <img
              src={heroImage}
              alt="Hero kids"
              className="w-full h-auto object-cover rounded-[40px_0_40px_0]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
