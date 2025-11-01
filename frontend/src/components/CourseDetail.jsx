// src/components/CourseDetail.jsx
import React, {useEffect, useState} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import axios from "axios";
import fallbackImg from "../assets/img10.png";

const API_URL = "https://mathsenseacademy.onrender.com/api/classes";

export default function CourseDetail(){
  const { classNumber, courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(()=>{
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
    if(courseId) fetchCourse();
  }, [courseId]);

  if(loading) return <div className="p-8 text-center">Loading…</div>;
  if(error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if(!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to={`/class/${classNumber}`} className="text-sm text-indigo-600">← Back</Link>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-start gap-6">
            <img src={course.image || fallbackImg} alt={course.title} className="w-36 h-36 object-cover rounded" />
            <div>
              <h1 className="text-2xl font-bold text-[#875714]">{course.title}</h1>
              <p className="text-sm text-gray-600">Class: {course.classRange} • {course.courseType ? 'Long' : 'Short'}</p>
              <p className="mt-4 text-gray-700">{course.description}</p>
            </div>
          </div>

          {/* Topics, books etc. */}
          {course.topics?.length > 0 && (
            <section className="mt-6">
              <h3 className="font-semibold text-[#875714]">Topics</h3>
              <ul className="list-disc pl-6 mt-2">
                {course.topics.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
