import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaFileAlt, FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import ProfileModal from "../ProfileModal";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const profileBtnRef = useRef(null);
  const [adminUser, setAdminUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Load admin info (from localStorage or any other state)
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    } else {
      setAdminUser({ name: "Admin", email: "admin@mathsenseacademy.com" });
    }
  }, []);

  // ✅ Add shadow when scrolling
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openProfile = () => {
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
              alt="Math Senseacademy"
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
                to="/admin/courses"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaFileAlt /> <span>Courses</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/batches"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaFileAlt /> <span>Batches</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/blog/new"
                className="flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                <FaFileAlt /> <span>Blogs</span>
              </Link>
            </li>
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
