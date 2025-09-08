// src/pages/CoursePage/CoursePage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicCourseDetails } from "../api/courseApi";
import CourseDetails from "../components/AdminPanel/Courses/CourseDetails";
import Curriculum from "../components/Curriculum";
import ClassroomEssentials from "../components/ClassroomEssentials";
import MeetTheTeacher from "../components/MeetTheTeacher";
import Testimonial from "../components/TestimonialSection";
import useLocoScroll from "../hooks/useLocoScroll";

export default function CoursePage({ sentinelRef }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { loco } = useLocoScroll(false);

  useEffect(() => {
    getPublicCourseDetails(id)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        loco?.update();
      });
  }, [id, loco]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-gray-600">Loading…</div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-gray-600">Course not found.</div>
      </div>
    );
  }

  const {
    course_name,
    course_subtitle,
    course_image_path,
    description,
    classroom_essentials = [],
  } = data;

  return (
    <>
      {/* invisible anchor for TopInfoBar */}
      <div
        ref={sentinelRef}
        className="absolute top-0 left-0 w-px h-px pointer-events-none"
      />

      <div className="max-w-4xl mx-auto p-4 flex flex-col gap-8 sm:p-2 sm:gap-4">
        <div className="w-full">
          <CourseDetails
            courseName={course_name}
            subtitle={course_subtitle}
            imagePath={course_image_path}
            description={description}
          />
        </div>

        <div className="w-full">
          <Curriculum />
        </div>

        <div className="w-full">
          <ClassroomEssentials items={classroom_essentials} />
        </div>
        <div className="w-full">
          <MeetTheTeacher />
        </div>

        <div className="w-full">
          <Testimonial />
        </div>
      </div>
    </>
  );
}