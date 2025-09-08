// src/components/CourseDetails/CourseDetails.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicCourseDetails } from "../../../api/courseApi";
import logo from "../../../assets/logoWithName.png";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    getPublicCourseDetails(id)
      .then((res) => setCourse(res.data))
      .catch(console.error);
  }, [id]);

  if (!course) {
    return (
      <div className="flex justify-center items-center my-10">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden my-10 font-['Roboto_Slab']">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        {/* Left bubbles */}
        <div className="relative flex flex-col items-start bg-[url('../../../assets/coursedetail.svg')] bg-contain bg-center bg-no-repeat h-[42rem] px-6">
          {/* Purple bubble */}
          <div className="relative bg-[#d9b1f9] clip-path-polygon-[0_0,85%_0,100%_15%,100%_100%,0_100%] p-6 text-black w-4/5">
            <h1 className="text-[3rem] md:text-[5rem] lg:text-[6rem] font-bold leading-tight truncate">
              {course.course_name}
            </h1>
          </div>

          {/* Orange bubble */}
          <div className="absolute top-[28rem] bg-orange-300 rounded-xl p-6 shadow-md">
            <p className="text-xl md:text-2xl font-semibold mb-4 max-w-md">
              {course.course_subtitle ||
                "Engaging, expert-led online math programs for kids from Grade"}
            </p>
            <button className="border-2 border-black rounded-full px-6 py-2 font-semibold hover:bg-black hover:text-white transition">
              Enroll Now
            </button>
          </div>

          {/* Circular arrow */}
          <button
            className="absolute top-[75%] right-12 translate-y-[90%] w-16 h-16 border-2 border-black rounded-full flex items-center justify-center bg-white text-lg hover:bg-black hover:text-white transition"
            onClick={() => {
              // handle navigation/scroll
            }}
          >
            ▶
          </button>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="inline-block px-4 py-2 border-2 border-yellow-300 rounded-full">
            <img
              src={logo}
              alt="MathSense Academy"
              className="w-64 md:w-80"
            />
          </div>

          {/* Student image */}
          <div className="flex justify-center">
            <img
              src={course.course_image_path}
              alt="Student"
              className="w-72 md:w-96 lg:w-[40rem] rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
