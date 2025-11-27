import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Rocket } from "lucide-react";

const ComingSoonCourses = () => {
  const courses = [
    { name: "JEE (Main & Advanced)", icon: <Rocket size={26} /> },
    { name: "UGC NET", icon: <BookOpen size={26} /> },
    { name: "UPSC", icon: <Clock size={26} /> },
    { name: "WBSC", icon: <BookOpen size={26} /> },
    { name: "NEET", icon: <Rocket size={26} /> },
    { name: "CUET", icon: <BookOpen size={26} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          🚀 New Courses Coming Soon!
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          We’re preparing something amazing for you — advanced preparation courses for competitive exams like <b>JEE</b>, <b>UGC NET</b>, <b>UPSC</b>, and more.  
          Stay tuned as we bring the best guidance right to your screen.
        </p>
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {courses.map((course, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white border border-blue-200 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition"
          >
            <div className="text-blue-600 mb-4">{course.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {course.name}
            </h3>
            <p className="text-gray-500 text-sm italic">Launching soon...</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer / CTA */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-700 text-lg mb-3">
          Want to be the first to know when these courses launch?
        </p>
        <a
          href="mailto:info@mathsenseacademy.com"
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition"
        >
          Notify Me
        </a>
      </motion.div>
    </div>
  );
};

export default ComingSoonCourses;
