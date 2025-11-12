// src/components/ClassDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import fallbackImg from "../assets/img10.png";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FaBookOpen, FaClock, FaUserTie, FaStar } from "react-icons/fa";
import mentor from "../assets/teacher.png";

const API_URL = "https://api-bqojuh5xfq-uc.a.run.app/api/classes";


export default function ClassDetails() {
  const { classNumber } = useParams();
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // local static content to enrich the page (safe to modify)
  const staticHighlights = [
    {
      title: "Concept-first teaching",
      desc: "We focus on concept clarity before practice — students truly *understand* topics, not just memorize steps.",
      icon: <FaBookOpen />
    },
    {
      title: "Flexible batches",
      desc: "Evening & weekend batches available. Students can switch batches if schedule conflicts arise.",
      icon: <FaClock />
    },
    {
      title: "Personal mentoring",
      desc: "Small group sizes and one-to-one mentoring make sure every student gets attention.",
      icon: <FaUserTie />
    },
    {
      title: "Exam-ready practice",
      desc: "Topic tests, previous year questions and timed mock tests prepare students for school & competitive exams.",
      icon: <FaStar />
    },
  ];

  const staticFAQs = [
    {
      q: "What is the class size?",
      a: "Typical batch size is 15–20 students. We keep groups small to ensure personalised attention."
    },
    {
      q: "Can my child switch batches if timing clashes?",
      a: "Yes — we allow switching (subject to availability). Contact admin via Whatsapp or call."
    },
    {
      q: "Will I get recordings?",
      a: "Yes. Every class is recorded and available to enrolled students for revision for a limited period."
    },
    {
      q: "What is the pricing?",
      a: "There is different pricing for various courses in monthly structure. Contact admin for current offers."
    },
    {
      q: "How experienced are the instructors?",
      a: "Instructors have 15 years of teaching experience and are passionate about math education."
    },
    {
      q: "What if my child misses a class?",
      a: "Recordings and notes of all classes are made available to students for revision and catching up on missed sessions."
    }
  ];

  const staticTestimonials = [
    {
      name: "Arjun (Parent)",
      text: "My child's confidence soared in 2 months. Clear explanations and excellent practice assignments!"
    },
    {
      name: "Priya (Student)",
      text: "Classes are fun and I actually look forward to math now. The quizzes are helpful."
    },
    {
      name: "Rohit (Parent)",
      text: "The mentor understood my child's struggles and tailored the sessions accordingly. Highly recommend!"
    },
    {
      name: "Sneha (Student)",
      text: "I improved my problem-solving speed and accuracy. The mock tests were just like the real exams."
    },
    {
      name: "Kavita (Parent)",
      text: "Great value for money. The small batch size ensured my child got the attention needed to excel."
    },
    {      name: "Meera (Parent)",
      text: "The personalized mentoring helped my child overcome specific challenges in math. Very grateful!"
    }
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(API_URL);
        const filtered = (res.data || []).filter(
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

  // Meta
  const pageTitle = `Class ${classNumber} Math Courses | MathSense Academy`;
  const pageDesc =
    classList[0]?.description?.slice(0, 160) ||
    `Explore Class ${classNumber} Maths courses, syllabus, topics, instructors and enrollment at MathSense Academy.`;

  const pageImg = classList[0]?.image || fallbackImg;

  // helper: human readable topics preview
  const topicsPreview = (topics = []) =>
    topics.length > 0 ? topics.slice(0, 6).join(", ") + (topics.length > 6 ? "…" : "") : "Syllabus details available in the sections below.";

  return (
    <div className="min-h-screen bg-[#f6f4f2] px-4 md:px-10 py-10 font-poppins">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImg} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImg} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Back + header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between gap-4">
        <div>
          <Link
            to="/classs"
            className="inline-flex items-center gap-2 text-[#7d4900] font-semibold hover:text-[#a66b1c] transition"
            aria-label="Back to classes"
          >
            ← Back to Programs
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#875714] mt-3">
            Class {classNumber} — Math Programs
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {classList.length} course{classList.length > 1 ? "s" : ""} available · {topicsPreview(classList[0]?.topics)}
          </p>
        </div>

        {/* Quick stats box */}
        <div className="hidden md:flex items-center gap-4">
          <div className="bg-white rounded-xl p-3 shadow-sm text-center w-40">
            <div className="text-xs text-gray-500">Avg. Rating</div>
            <div className="text-xl font-bold text-[#875714] mt-1 flex items-center justify-center gap-2">
              4.8 <FaStar className="text-yellow-400" />
            </div>
            <div className="text-xs text-gray-400">Based on parent feedback</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center w-44">
            <div className="text-xs text-gray-500">Avg. Batch Size</div>
            <div className="text-xl font-bold text-[#875714] mt-1">Less Than 25</div>
            <div className="text-xs text-gray-400">Small groups for focus</div>
          </div>
        </div>
      </div>

      {/* Courses grid */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left column: list of courses */}
        <div className="lg:col-span-2 space-y-8">
          {classList.length > 0 ? (
            classList.map((cls, i) => (
              <article
                key={cls._id || i}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
                aria-labelledby={`course-${i}-title`}
              >
                {/* Course Hero */}
                <div className="grid md:grid-cols-3 gap-4 items-center p-6 bg-gradient-to-r from-[#fff6e6] to-[#fffaf3]">
                  <div className="md:col-span-2">
                    <h2 id={`course-${i}-title`} className="text-2xl md:text-3xl font-bold text-[#875714]">
                      {cls.title || `Class ${cls.classRange}`}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cls.courseType ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {cls.courseType ? "Regular" : "Short"} Course
                      </span>
                      <span className="text-sm text-gray-600">· Duration: {cls.duration || "Ongoing"}</span>
                      <span className="text-sm text-gray-600">· Mode: Online</span>
                    </div>

                    <p className="mt-4 text-gray-700 leading-relaxed">
                      {cls.description || "A structured course designed to strengthen concepts and improve problem solving for school & exam success."}
                    </p>

                    {/* CTA small */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => navigate("/login/student")}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#875714] text-white font-semibold hover:bg-[#a66b1c] transition"
                        aria-label={`Enroll to ${cls.title || "this course"}`}
                      >
                        Enroll Now
                      </button>
                      <button
                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                        className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                      >
                       <a href="tel:+919147718572"> Contact Us </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Course body */}
                <div className="p-6 space-y-6">
                  {/* Topics */}
                  <section aria-labelledby={`topics-${i}-title`}>
                    <h3 id={`topics-${i}-title`} className="text-lg font-semibold text-[#875714]">What we cover</h3>
                    {cls.topics?.length ? (
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        {cls.topics.map((topic, tIdx) => (
                          <div key={tIdx} className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-gray-700">
                            {topic}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-2">Full syllabus shared with enrolled students.</p>
                    )}
                  </section>

                  {/* Suggested books */}
                  {cls.suggestedBooks?.length > 0 && (
                    <section aria-labelledby={`books-${i}-title`}>
                      <h3 id={`books-${i}-title`} className="text-lg font-semibold text-[#875714]">Suggested Books</h3>
                      <ul className="mt-3 list-disc pl-5 space-y-1 text-gray-700">
                        {cls.suggestedBooks.map((book, bIdx) => <li key={bIdx}>{book}</li>)}
                      </ul>
                    </section>
                  )}

                  {/* Curriculum Highlights (static enriched) */}
                  <section aria-labelledby={`highlights-${i}-title`}>
                    <h3 id={`highlights-${i}-title`} className="text-lg font-semibold text-[#875714]">Course Highlights</h3>
                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      {staticHighlights.map((h, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border shadow-sm flex items-start gap-3">
                          <div className="text-amber-600 text-xl mt-1">{h.icon}</div>
                          <div>
                            <div className="font-semibold text-gray-800">{h.title}</div>
                            <div className="text-sm text-gray-600">{h.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Instructor / Mentor (static placeholder if none) */}
                  <section className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-[#875714]">Instructor</h3>
                    <div className="flex items-center gap-4 mt-3">
                      <img
                        src={mentor}
                        alt={cls.instructorName || "Instructor photo"}
                        className="w-20 h-20 rounded-full object-cover shadow-sm"
                        onError={(e) => (e.target.src = fallbackImg)}
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{cls.instructorName || "Experienced Math Mentor"}</div>
                        <div className="text-sm text-gray-600">{cls.instructorBio || "PhD with 15+ years of teaching experience in school & competitive exams."}</div>
                      </div>
                    </div>
                  </section>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-600 py-20 text-lg">No courses found for this class.</p>
          )}
        </div>

        
        <aside className="space-y-6">
          {/* Testimonials */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h4 className="font-semibold text-[#875714]">What parents say</h4>
            <div className="mt-3 space-y-3 text-sm">
              {staticTestimonials.map((t, idx) => (
                <div key={idx} className="bg-sky-50 p-3 rounded">
                  <div className="font-medium text-gray-800">{t.name}</div>
                  <div className="text-gray-600 mt-1">{t.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h4 className="font-semibold text-[#875714]">FAQ</h4>
            <div className="mt-3 space-y-2 text-sm">
              {staticFAQs.map((f, idx) => (
                <details key={idx} className="bg-sky-50 p-3 rounded">
                  <summary className="font-medium">{f.q}</summary>
                  <div className="mt-2 text-gray-600">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom CTA + helpful resources */}
      <div className="max-w-6xl mx-auto mt-12 bg-gradient-to-r from-[#fffaf3] to-[#fff6e6] p-8 rounded-3xl shadow-inner border border-gray-100">
        <div className="md:flex md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[#875714]">Ready to start?</h3>
            <p className="text-gray-700 mt-2">Enroll today and give your child the confidence to excel in maths.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button onClick={() => navigate("/login/student")} className="px-6 py-3 rounded-full bg-[#875714] text-white font-semibold hover:bg-[#a66b1c] transition">
              Enroll Now
            </button>
             <div className="mt-3 text-xs text-gray-500">
              Or call us: <a href="tel:+919147718572" className="text-[#7d4900] font-semibold">+91 9147718572</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
