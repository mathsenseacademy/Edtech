// src/components/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import fallbackImg from "../../assets/img10.png";
import { Helmet } from "react-helmet-async";

const API_URL = "https://api-bqojuh5xfq-uc.a.run.app/api/classes";

export default function CourseDetail() {
  const { classNumber, courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Course not found");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading)
    return (
      <div className="py-20 text-center text-lg text-gray-500 animate-pulse">
        Fetching course details…
      </div>
    );
  if (error)
    return (
      <div className="py-20 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  if (!course) return null;

  const pageTitle = `${course.title} | MathSense Academy`;
  const pageDesc =
    course.description?.slice(0, 150) ||
    "Explore detailed math course content at MathSense Academy.";

  const pageImg = course.image || fallbackImg;

  return (
    <div className="min-h-screen bg-[#f7f3ef] px-6 py-10 font-poppins">

      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImg} />
        <meta property="og:type" content="article" />

        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImg} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Back link */}
        <Link
          to={`/class/${classNumber}`}
          className="text-[#875714] hover:text-[#a66b1c] font-semibold inline-flex items-center gap-2 transition"
        >
          <span>←</span> Back to Class {classNumber}
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">

          <div className="flex flex-col md:flex-row md:items-start gap-10">

            {/* Image */}
            <img
              src={pageImg}
              alt={course.title}
              className="w-full md:w-64 h-64 object-cover rounded-2xl shadow-md bg-white"
            />

            {/* Header Content */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-[#875714] leading-tight">
                {course.title}
              </h1>

              <p className="mt-3 text-gray-600 text-sm font-medium">
                Class {course.classRange} •{" "}
                <span className="text-[#875714] font-semibold">
                  {course.courseType ? "Regular" : "Short"} Course
                </span>
              </p>

              {/* Description */}
              {course.description && (
                <p className="mt-6 text-gray-700 leading-relaxed text-[15.5px]">
                  {course.description}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 border-t border-gray-200"></div>

          {/* Topics Section */}
          {course.topics?.length > 0 && (
            <section>
              <h3 className="text-2xl font-semibold text-[#875714] mb-4">
                Topics Covered
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.topics.map((t, i) => (
                  <div
                    key={i}
                    className="bg-[#fff7e9] border border-[#f0d9b6] px-4 py-3 rounded-xl shadow-sm text-gray-700 text-[15px]"
                  >
                    ✅ {t}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Static Add-on: Why this course */}
          <div className="mt-10 bg-[#fdf7ef] p-6 rounded-2xl border border-[#e8d8c4] shadow-sm">
            <h3 className="text-xl font-bold text-[#875714] mb-3">
              Why Students Love This Course
            </h3>
            <ul className="space-y-2 text-gray-700 text-[15px]">
              <li>• Concept-first teaching approach</li>
              <li>• Chapter-wise strategies that actually work in exams</li>
              <li>• Practice worksheets & assessments</li>
              <li>• Clarified explanations tailored for students</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
