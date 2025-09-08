// src/components/Roles.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const navigate = useNavigate();

  const roles = [
    {
      label: "Guardian",
      description: "Parents and Guardians",
      path: "/login/guardian",
      color: "bg-blue-500 hover:bg-blue-700",
      image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    },
    {
      label: "Student",
      description: "Students and Learners",
      path: "/login/student",
      color: "bg-green-500 hover:bg-green-700",
      image: "https://cdn-icons-png.flaticon.com/512/201/201818.png",
    },
    {
      label: "Teacher",
      description: "Teachers and Mentors",
      path: "/login/teacher",
      color: "bg-purple-500 hover:bg-purple-700",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
    },
  ];

  return (
    <motion.div
      className="bg-teal-100 shadow-2xl rounded-2xl p-10 text-center max-w-5xl w-full mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-teal-600 mb-10 text-xl font-semibold">
        Please select your role to continue:
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <motion.div
            key={role.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-100 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition duration-300 border border-gray-100"
          >
            <img
              src={role.image}
              alt={role.label}
              className="w-36 h-36 mb-4 rounded-xl shadow-md object-cover border-4 border-white"
            />

            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {role.description}
            </h2>

            <button
              onClick={() => navigate(role.path)}
              className={`${role.color} text-white px-4 py-2 rounded-lg mt-auto w-full md:w-auto transition`}
            >
              Continue as {role.label}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Roles;
