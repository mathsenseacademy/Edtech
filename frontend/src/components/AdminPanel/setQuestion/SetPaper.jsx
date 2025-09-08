// src/components/AdminPanel/SetPaper/SetPaper.jsx
import { useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { FaPlus, FaList, FaSearch } from "react-icons/fa";

import CreateQuestions from "./CreateQuestions";
import GetQuestionById from "./GetQuestionById";
import AllQuestions from "./AllQuestions";
import EditQuestions from "./EditQuestions";

const SetPaper = () => {
  const [open, setOpen] = useState(false);
  const base = "/admin/set-paper";

  const tabs = [
    { to: `${base}/create`, icon: <FaPlus />, label: "Create" },
    { to: `${base}/get-one`, icon: <FaSearch />, label: "Get by ID" },
    { to: `${base}/all`, icon: <FaList />, label: "All" },
  ];

  return (
    <section className="flex min-h-screen font-poppins">
      {/* hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white text-2xl bg-[#1b263b] px-3 py-1 rounded-md"
        onClick={() => setOpen(!open)}
      >
        ≡
      </button>

      {/* sidebar */}
      <nav
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-60 bg-[#0d1b2a] text-white p-4 flex flex-col gap-4 transform transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {tabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition 
              ${isActive ? "bg-[#1b263b]" : "hover:bg-[#1b263b]"}`
            }
          >
            {icon} <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* content */}
      <div className="flex-1 p-6 md:ml-60">
        <Routes>
          <Route index element={<Navigate to="create" replace />} />
          <Route path="create" element={<CreateQuestions />} />
          <Route path="get-one" element={<GetQuestionById />} />
          <Route path="all" element={<AllQuestions />} />
          <Route path="edit/:qid" element={<EditQuestions />} />
        </Routes>
      </div>
    </section>
  );
};

export default SetPaper;
