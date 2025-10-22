// src/components/Header/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const classes = Array.from({ length: 12 }, (_, i) => ({
    name: `Class ${i + 1}`,
    number: i + 1
  }));

  // Course data with routes (all go to coming-soon)
  const courses = [
    { name: "JEE" },
    { name: "UGC" },
    { name: "NET" },
    { name: "UPSC" },
    { name: "WBSC" },
    { name: "Other Exams" }
  ];

  const { t } = useTranslation();
  const navigate = useNavigate();

  // Decode JWT token (safe try/catch)
  useEffect(() => {
    const tok = localStorage.getItem("accessToken");
    if (!tok) return;
    try {
      setAdminUser(jwtDecode(tok));
    } catch (err) {
      // invalid token -> ignore
    }
  }, []);

  // Sticky register button observer
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile drawer open
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
    { type: "anchor", to: "blog", label: t("Blog") }
  ];

  const socialLinks = [
    { href: "https://wa.me/9062428472", icon: FaWhatsapp, label: "Whatsapp" },
    { href: "https://www.facebook.com/shomesirmath/", icon: FaFacebookF, label: "Facebook" },
    { href: "https://x.com/ShomeSuvad79678", icon: FaTwitter, label: "Twitter" },
    { href: "https://www.instagram.com/maths_ense", icon: FaInstagram, label: "Instagram" },
    { href: "https://www.youtube.com/@mathsenseacademy", icon: FaYoutube, label: "YouTube" },
    { href: "https://www.linkedin.com/in/suvadip-shome-1817ba289/", icon: FaLinkedinIn, label: "LinkedinIn" }
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
          <div className="max-w-7xl mx-auto px-4 py-1">
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
        <nav className="bg-gradient-to-r from-gray-300 to-stone-900 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
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
                            key={cls.number}
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer transition"
                            onClick={() => {
                              navigate(`/programs/class/${cls.number}`);
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
                            key={course.name}
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer transition"
                            onClick={() => {
                              navigate("/coming-soon");
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
              <button
                onClick={() => navigate("/login/student")}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-700"
              >
                Login
              </button>

            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>

        {/* Spacer div */}
        <div className="h-[4px] lg:h-[4px]" />

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
      </motion.header>

      {/* Mobile Right-side Drawer (80% width) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          // Overlay + Drawer container
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* Dimmed overlay (left 20%) - clickable */}
            <div className="w-1/5" />

            {/* Drawer (right 80%) */}
            <motion.aside
              ref={mobileMenuRef}
              className="w-4/5 h-full overflow-y-auto shadow-2xl"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside drawer
            >
              <div className="h-full bg-gradient-to-b from-white to-gray-100 text-gray-800 p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <img
                    src={logo}
                    alt="Math Sense Academy"
                    className="h-10 cursor-pointer"
                    onClick={() => {
                      navigate("/");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setMobileMenuOpen(false);
                    }}
                  />

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-md hover:bg-gray-200"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Contact block */}
                <div className="mt-6 border rounded-lg p-4 bg-white shadow-sm">
                  <a href="tel:+919147718572" className="flex items-center gap-3 text-sm font-medium">
                    <Phone size={16} />
                    <span>+91 9147718572</span>
                  </a>
                  <a href="mailto:mathsenseacademy@gmail.com" className="flex items-center gap-3 text-sm font-medium mt-2">
                    <Mail size={16} />
                    <span>mathsenseacademy@gmail.com</span>
                  </a>

                  <div className="flex items-center gap-3 mt-3">
                    {socialLinks.map(({ href, icon: Icon, label }) => (
                      <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="p-1 rounded-md hover:bg-gray-200">
                        <Icon />
                      </a>
                    ))}
                  </div>
                </div>

                <nav className="mt-6 flex-1 overflow-y-auto">
                  {/* Classes accordion */}
                  <div className="mt-2">
                    <button
                      onClick={() => setClassDropdownOpen((p) => !p)}
                      className="w-full flex items-center justify-between py-3 px-2 font-medium"
                    >
                      <span> {t("Class")} </span>
                      <ChevronDown size={18} className={`${classDropdownOpen ? 'rotate-180' : ''} transform transition`} />
                    </button>

                    <AnimatePresence>
                      {classDropdownOpen && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="pl-4 space-y-2 overflow-hidden"
                        >
                          {classes.map((cls) => (
                            <li key={cls.number}>
                              <button
                                className="w-full text-left py-2"
                                onClick={() => {
                                  navigate(`/programs/class/${cls.number}`);
                                  setClassDropdownOpen(false);
                                  setMobileMenuOpen(false);
                                }}
                              >
                                {cls.name}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Courses accordion */}
                  <div className="mt-2">
                    <button
                      onClick={() => setCourseDropdownOpen((p) => !p)}
                      className="w-full flex items-center justify-between py-3 px-2 font-medium"
                    >
                      <span> {t("Courses")} </span>
                      <ChevronDown size={18} className={`${courseDropdownOpen ? 'rotate-180' : ''} transform transition`} />
                    </button>

                    <AnimatePresence>
                      {courseDropdownOpen && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="pl-4 space-y-2 overflow-hidden"
                        >
                          {courses.map((course) => (
                            <li key={course.name}>
                              <button
                                className="w-full text-left py-2"
                                onClick={() => {
                                  navigate('/coming-soon');
                                  setCourseDropdownOpen(false);
                                  setMobileMenuOpen(false);
                                }}
                              >
                                {course.name}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Main nav links */}
                  <ul className="mt-4 space-y-2">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        {item.type === 'link' ? (
                          <Link to={item.to} onClick={() => setMobileMenuOpen(false)} className="block py-3 font-medium">
                            {item.label}
                          </Link>
                        ) : (
                          <a href={`#${item.to}`} onClick={() => setMobileMenuOpen(false)} className="block py-3 font-medium">
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      navigate('/login/student');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-700"
                  >
                    Login
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  © {new Date().getFullYear()} Math Sense Academy
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
