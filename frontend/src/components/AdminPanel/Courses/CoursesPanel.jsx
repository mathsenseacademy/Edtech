// src/components/AdminPanel/Courses/CoursesPanel.jsx
import { useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { FaList, FaPlus, FaEdit, FaBook } from "react-icons/fa";
import { motion } from "framer-motion";

import AllCourses from "./AllCourses";
import CreateCourse from "./CreateCourse";

import AllCurriculums from "./Curriculum/AllCurriculums";
import CreateCurriculum from "./Curriculum/AddCurriculum";
import EditCurriculum from "./Curriculum/EditCurriculum";

import AllClassroomEssentials from "./ClassroomEssentials/AllClassroomEssentials";
import Essentials from "./ClassroomEssentials/Essentials";

export default function CoursesPanel() {
  const [open, setOpen] = useState(false);

  const base = "/admin/courses";

  const tabs = [
    { to: `${base}/all`, icon: <FaList />, label: "Show All Courses" },
    { to: `${base}/curriculums`, icon: <FaBook />, label: "All Curriculums" },
    { to: `${base}/essentials`, icon: <FaBook />, label: "All ClassroomEssential" },
    { to: `${base}/create`, icon: <FaPlus />, label: "Add Course" },
    { to: `${base}/curriculums/create`, icon: <FaBook />, label: "Add Curriculum" },
    { to: `${base}/essentials/create`, icon: <FaEdit />, label: "Add Essentials" },
  ];

  return (
    <section className="flex min-h-screen">
      {/* Toggle button */}
      <button
        className="md:hidden m-2 px-4 py-2 border rounded text-sm font-medium text-blue-600 border-blue-600 hover:bg-blue-50"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕ Close" : "☰ Courses Menu"}
      </button>

      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={open ? { x: 0 } : { x: -440 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-gray-100 border-r flex flex-col z-20 p-4"
      >
        {tabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 mb-2 px-3 py-2 rounded hover:bg-gray-200 transition ${
                isActive ? "font-bold text-blue-600 bg-gray-200" : "text-gray-700"
              }`
            }
            onClick={() => setOpen(false)}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </motion.nav>

      {/* Main content */}
      <motion.div
        className="flex-1 p-6 md:ml-0"
        initial={false}
        animate={open ? { marginLeft: 0 } : { marginLeft: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setOpen(false)}
      >
        <Routes>
          <Route index element={<Navigate to="all" replace />} />
          <Route path="all" element={<AllCourses />} />
          <Route path="create" element={<CreateCourse />} />
          <Route path="edit/:id" element={<CreateCourse />} />

          {/* Curricula */}
          <Route path="curriculums" element={<AllCurriculums />} />
          <Route path="curriculums/create" element={<CreateCurriculum />} />
          <Route path="curriculums/edit/:id" element={<EditCurriculum />} />

          {/* Classroom essentials */}
          <Route path="essentials" element={<AllClassroomEssentials />} />
          <Route path="essentials/create" element={<Essentials />} />
          <Route path="essentials/edit/:essentialsId" element={<Essentials />} />

          <Route path="*" element={<Navigate replace to="all" />} />
        </Routes>
      </motion.div>
    </section>
  );
}
