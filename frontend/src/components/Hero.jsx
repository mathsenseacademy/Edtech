// src/components/Hero.jsx
import React, { useState } from "react";
import StudentRegister from "../pages/StudentRegister";
import heroImage from "../assets/hero-1.png";

const Hero = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <section className="w-full min-h-screen font-poppins bg-gradient-to-r from-sky-300 to-green-300 overflow-hidden flex items-center">
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8">
        {/* Left content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Unlock Your Child's{" "}
            <span className="text-amber-700">Math Potential</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-amber-900 mb-8 max-w-xl mx-auto md:mx-0">
            Fun, engaging, and expert-led math programs designed to build
            confidence and skills from an early age.
          </p>
          <button
            className="bg-green-200 text-blue-900 font-bold text-base sm:text-lg px-8 sm:px-10 py-3 rounded-full border-2 border-white shadow-lg hover:scale-105 hover:bg-yellow-300 transition-all duration-300"
            onClick={() => setShowRegisterModal(true)}
          >
            🚀 REGISTER STUDENT
          </button>
        </div>

        {/* Right image */}
        <div className="flex-1 relative flex justify-center">
          <div className="inline-block w-[90%] md:w-auto border-4 border-white rounded-[40px_0_40px_0] shadow-2xl overflow-hidden">
            <img
              src={heroImage}
              alt="Hero kids"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Student Registration Modal */}
      {showRegisterModal && (
        <StudentRegister onClose={() => setShowRegisterModal(false)} />
      )}
    </section>
  );
};

export default Hero;
