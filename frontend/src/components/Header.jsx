// src/components/Header/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn
} from "react-icons/fa";
import { Phone, Mail, Menu, X, ChevronDown } from "lucide-react";
import logo from "../assets/logoWith_Name.svg";
import StudentRegister from "../pages/StudentRegister";

const Header = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [showStickyRegister, setShowStickyRegister] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  

  const coursesRef = useRef(null);
  const classRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Class data with routes
  const classes = Array.from({ length: 10 }, (_, i) => ({
    name: `Class ${i + 1}`,
    route: `/class${i + 1}`
  }));

  // Course data with routes
  const courses = [
    { name: "JEE", route: "/jee" },
    { name: "UGC", route: "/ugc" },
    { name: "NET", route: "/net" },
    { name: "UPSC", route: "/upsc" },
    { name: "WBSC", route: "/wbsc" },
    { name: "Other Exams", route: "/other-exams" }
  ];

  const { t } = useTranslation();
  const navigate = useNavigate();

  // Decode JWT token
  useEffect(() => {
    const tok = localStorage.getItem("accessToken");
    if (!tok) return;
    try {
      setAdminUser(jwtDecode(tok));
    } catch {
      /* ignore invalid token */
    }
  }, []);

  // Sticky register button
  useEffect(() => {
    const hero = document.querySelector("#hero");
    if (!hero) return;
    const ob = new IntersectionObserver(
      ([e]) => setShowStickyRegister(!e.isIntersecting),
      { threshold: 0.1 }
    );
    ob.observe(hero);
    return () => ob.disconnect();
  }, []);

  

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (classRef.current && !classRef.current.contains(e.target)) {
        setClassDropdownOpen(false);
      }
      if (coursesRef.current && !coursesRef.current.contains(e.target)) {
        setCourseDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { type: "link", to: "/", label: t("Home") },
    { type: "anchor", to: "programs", label: t("OurProgram") },
    { type: "anchor", to: "testimonials", label: t("Testimonials") },
    { type: "anchor", to: "about", label: t("About") },
    { type: "anchor", to: "blog", label: t("Blog") },
  ];

  const socialLinks = [
    { href: "https://wa.me/9062428472", icon: FaWhatsapp, label: "Whatsapp" },
    { href: "https://www.facebook.com/shomesirmath/", icon: FaFacebookF, label: "Facebook" },
    { href: "https://x.com/ShomeSuvad79678", icon: FaTwitter, label: "Twitter" },
    { href: "https://www.instagram.com/maths_ense", icon: FaInstagram, label: "Instagram" },
    { href: "https://www.youtube.com/@mathsenseacademy", icon: FaYoutube, label: "YouTube" },
    { href: "https://www.linkedin.com/in/suvadip-shome-1817ba289/", icon: FaLinkedinIn, label: "LinkedinIn" },
  ];

  return (
    <>
      {/* ── Fixed Header ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-stone-900 to-gray-700 text-white shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Info Bar - Desktop Only */}
        <div className="hidden lg:block bg-gradient-to-r from-gray-800 to-stone-800">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <a
                  href="tel:+919147718572"
                  className="flex items-center gap-2 hover:text-yellow-300 transition"
                >
                  <Phone size={14} /> +91 9147718572
                </a>
                <a
                  href="mailto:mathsenseacademy@gmail.com"
                  className="flex items-center gap-2 hover:text-yellow-300 transition"
                >
                  <Mail size={14} /> mathsenseacademy@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span>Follow us:</span>
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="hover:text-yellow-300 transition text-sm"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="bg-gradient-to-r from-stone-900 to-gray-700 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <motion.div
              layoutId="shared-logo"
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              className="flex items-center gap-6"
            >
              <img
                src={logo}
                alt="Math Sense Academy"
                className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
              />

              {/* Desktop Dropdowns */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Class Dropdown */}
                <div ref={classRef} className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-1 hover:text-yellow-300 font-medium transition"
                    onClick={() => setClassDropdownOpen((prev) => !prev)}
                  >
                    {t("Class")}
                    <ChevronDown 
                      size={16}
                      className={`transform transition-transform ${
                        classDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {classDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 bg-white text-gray-900 rounded shadow-lg overflow-hidden w-40 z-50"
                      >
                        {classes.map((cls) => (
                          <li
                            key={cls.route}
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer transition"
                            onClick={() => {
                              navigate(cls.route);
                              setClassDropdownOpen(false);
                            }}
                          >
                            {cls.name}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Courses Dropdown */}
                <div ref={coursesRef} className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-1 hover:text-yellow-300 font-medium transition"
                    onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                  >
                    {t("Courses")}
                    <ChevronDown 
                      size={16}
                      className={`transform transition-transform ${
                        courseDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {courseDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 bg-white text-gray-900 rounded shadow-lg overflow-hidden w-48 z-50"
                      >
                        {courses.map((course) => (
                          <li
                            key={course.route}
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer transition"
                            onClick={() => {
                              navigate(course.route);
                              setCourseDropdownOpen(false);
                            }}
                          >
                            {course.name}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.type === "link" ? (
                      <Link
                        to={item.to}
                        className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={`#${item.to}`}
                        className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              {/* Desktop Auth Button */}
             {/* Desktop Auth Button */}
<button
  onClick={() => navigate("/login/student")}
  className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-700"
>
 Admin Login
</button>

            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* 📱 Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-x-0 top-[120px] bg-gradient-to-r from-stone-900 to-gray-700 text-white shadow-lg z-40 max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              <ul className="flex flex-col p-4 gap-4">
                {/* Classes Dropdown */}
                <li>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 hover:text-yellow-300 transition"
                    onClick={() => setClassDropdownOpen((prev) => !prev)}
                  >
                    {t("Class")}
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        classDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {classDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-6 mt-2 space-y-2 overflow-hidden"
                      >
                        {classes.map((cls) => (
                          <li
                            key={cls.route}
                            className="cursor-pointer hover:text-yellow-300 transition py-1"
                            onClick={() => {
                              navigate(cls.route);
                              setClassDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            {cls.name}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {/* Courses Dropdown */}
                <li>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 hover:text-yellow-300 transition"
                    onClick={() => setCourseDropdownOpen((prev) => !prev)}
                  >
                    {t("Courses")}
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        courseDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {courseDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-6 mt-2 space-y-2 overflow-hidden"
                      >
                        {courses.map((course) => (
                          <li
                            key={course.route}
                            className="cursor-pointer hover:text-yellow-300 transition py-1"
                            onClick={() => {
                              navigate(course.route);
                              setCourseDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            {course.name}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {/* Navigation Links */}
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.type === "link" ? (
                      <Link
                        to={item.to}
                        className="block px-3 py-2 hover:text-yellow-300 transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={`#${item.to}`}
                        className="block px-3 py-2 hover:text-yellow-300 transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}

                {/* Auth Button */}
                <li className="px-3 py-2">
                  {/* Auth Button */}
<li className="px-3 py-2">
  <button
    onClick={() => navigate("/login/student")}
    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-700 w-full"
  >
    Admin Login
  </button>
</li>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer div */}
      <div className="h-[120px] lg:h-[150px]" />

      {/* Sticky Register Button */}
      {showStickyRegister && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 px-5 py-3 font-semibold text-gray-900 bg-yellow-500 rounded-full shadow-lg hover:scale-105 hover:bg-green-500 transition z-40"
          onClick={() => setShowRegisterModal(true)}
        >
          {t("Student Register")}
        </motion.button>
      )}

      {/* Student Register Modal */}
      {showRegisterModal && (
        <StudentRegister onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
};

export default Header;