// src/components/layout/AdminHeader.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,            // Students
  FaChalkboardTeacher, // Classes
  FaLayerGroup,        // Batches
  FaBlog,              // Blogs
  FaClipboardList,     // Exams
  FaUserCircle,        // Profile
} from "react-icons/fa";
import logo from "../../assets/logo.jpg";
import ProfileModal from "../../components/common/ProfileModal";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const profileBtnRef = useRef(null);
  const [adminUser, setAdminUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    } else {
      setAdminUser({ name: "Admin", email: "admin@mathsenseacademy.com" });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openProfile = () => {
    if (!profileBtnRef.current) {
      setShowProfile(true);
      return;
    }
    const rect = profileBtnRef.current.getBoundingClientRect();
    setAnchor({ top: rect.bottom + 8, left: rect.right });
    setShowProfile(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[1050] transition-all duration-300 ${
          isScrolled ? "bg-blue-500/60 shadow-md" : "bg-blue-500/25"
        } backdrop-blur-md`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.img
              layoutId="shared-logo"
              src={logo}
              alt="Math Sense Academy"
              className="w-14"
            />
          </Link>

          {/* Nav Links */}
          <ul className="flex items-center gap-6 font-semibold text-white">
            <li>
              <Link
                to="/admin-dashboard"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaUsers /> <span>Students</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/classes"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaChalkboardTeacher /> <span>Classes</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/batches"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaLayerGroup /> <span>Batches</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/blog/new"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaBlog /> <span>Blogs</span>
              </Link>
            </li>

            {/* Exams main list */}
            <li>
              <Link
                to="/admin/exams"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaClipboardList /> <span>Exams</span>
              </Link>
            </li>

            {/* 🔹 Question Bank upload */}
            <li>
              <Link
                to="/admin/question-bank/upload"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <span>Question Bank</span>
              </Link>
            </li>

            {/* 🔹 Create Exam from Bank */}
            <li>
              <Link
                to="/admin/exams/create-from-bank"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <span>Create Exam</span>
              </Link>
            </li>

            {/* Optional profile button */}
            {/* <li>
              <button
                ref={profileBtnRef}
                onClick={openProfile}
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaUserCircle /> <span>Profile</span>
              </button>
            </li> */}
          </ul>
        </div>
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        show={showProfile}
        onClose={() => setShowProfile(false)}
        onLogout={handleLogout}
        anchor={anchor}
        user={{
          name: adminUser?.name || "Admin",
          email: adminUser?.email || "no-email@example.com",
          username: adminUser?.username || "mathsense-admin",
          avatar: adminUser?.avatar || "https://i.pravatar.cc/150",
        }}
      />
    </>
  );
};

export default AdminHeader;
