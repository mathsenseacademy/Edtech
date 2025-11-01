import React from "react";
import { FaChalkboardTeacher, FaBookOpen, FaLaptopCode, FaUserGraduate, FaBrain } from "react-icons/fa";

// import aboutImage from "../assets/about-hero.png"; 

export default function About() {
  return (
    <section className="bg-[#fffdf6] min-h-screen font-poppins text-gray-800">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 items-center gap-8 px-8 py-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#875714] mb-4">
            About Mathsense Academy
          </h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Mathsense Academy is an innovative learning platform focused on making 
            mathematics simple, conceptual, and engaging. Our goal is to help students 
            from Class 1 to 12 develop strong mathematical foundations that empower 
            them for competitive exams and lifelong problem-solving skills.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={aboutImage}
            alt="About Mathsense Academy"
            className="rounded-3xl w-[80%] shadow-md"
          />
        </div>
      </div>

      {/* Our Features */}
      <div className="bg-white px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#875714] mb-10">
          Our Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="p-6 rounded-2xl shadow-md bg-[#fff9ef] hover:shadow-lg transition">
            <FaChalkboardTeacher className="text-4xl text-[#875714] mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
            <p className="text-gray-600">
              Learn from highly experienced educators who simplify complex math concepts.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-[#fff9ef] hover:shadow-lg transition">
            <FaBookOpen className="text-4xl text-[#875714] mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Structured Curriculum</h3>
            <p className="text-gray-600">
              Step-by-step courses designed to build clarity, logic, and confidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-[#fff9ef] hover:shadow-lg transition">
            <FaLaptopCode className="text-4xl text-[#875714] mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Real-time examples, practice sets, and assessments for every topic.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-[#fff9ef] hover:shadow-lg transition">
            <FaUserGraduate className="text-4xl text-[#875714] mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor growth with performance analytics and detailed feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="px-8 py-16 bg-[#fef8ec]">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#875714] mb-10">
          Our Courses
        </h2>
        <div className="max-w-3xl mx-auto text-center text-gray-700 text-lg leading-relaxed">
          <p>
            We offer comprehensive courses that cover every grade level — from 
            early school to pre-university preparation. Whether it’s fundamental 
            arithmetic or advanced calculus, each course is designed with clarity, 
            examples, and regular practice sessions.
          </p>
          <ul className="list-disc list-inside mt-6 text-left">
            <li>Class 1–8: Building strong mathematical foundations.</li>
            <li>Class 9–10: Conceptual understanding with NCERT alignment.</li>
            <li>Class 11–12: Advanced preparation for boards and entrance exams.</li>
            <li>Special Courses: JEE, UGC NET, UPSC, WBSC and more coming soon.</li>
          </ul>
        </div>
      </div>

      {/* Math Focus Section */}
      <div className="bg-white px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#875714] mb-10">
          Why Focus on Mathematics?
        </h2>
        <div className="max-w-4xl mx-auto text-center">
          <FaBrain className="text-5xl text-[#875714] mx-auto mb-6" />
          <p className="text-lg text-gray-700 leading-relaxed">
            Mathematics is the foundation of logical thinking, problem-solving, and 
            innovation. At Mathsense Academy, we help learners go beyond memorization — 
            to truly understand the “why” behind every concept. Our programs are designed 
            to make students confident, creative, and passionate about math.
          </p>
        </div>
      </div>
    </section>
  );
}
