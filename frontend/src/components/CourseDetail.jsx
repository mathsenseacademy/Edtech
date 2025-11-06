// src/components/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import fallbackImg from "../assets/img10.png";
import { Helmet } from "react-helmet-async";

const API_URL = "https://mathsenseacademy.onrender.com/api/classes";

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

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!course) return null;

  const pageTitle = `${course.title} | MathSense Academy`;
  const pageDesc =
    course.description?.slice(0, 150) ||
    "Explore detailed math course content at MathSense Academy.";

  const pageImg = course.image || fallbackImg;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">

      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />

        {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImg} />
        <meta property="og:type" content="article" />

        {/* Twitter Card */}
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImg} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        <Link to={`/class/${classNumber}`} className="text-sm text-indigo-600">
          ← Back
        </Link>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-start gap-6">

            <img
              src={pageImg}
              alt={course.title}
              className="w-36 h-36 object-cover rounded"
            />

            <div>
              <h1 className="text-3xl font-extrabold text-[#875714]">
                {course.title}
              </h1>

              <h2 className="text-sm text-gray-600 mt-1">
                Class: {course.classRange} • {course.courseType ? "Regular" : "Short"}
              </h2>

              <p className="mt-4 text-gray-700 leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {/* Topics */}
          {course.topics?.length > 0 && (
            <section className="mt-6">
              <h3 className="font-semibold text-[#875714] text-lg">
                Topics Covered
              </h3>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                {course.topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
