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
} from "react-icons/fa";
import { Phone, Mail, Menu, X, ChevronDown } from "lucide-react";
import api from "../api/api";
import { getActiveCourses } from "../api/courseApi";
import logo from "../assets/logoWith_Name.svg";
import StudentRegister from "../pages/StudentRegister";

const Header = () => {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [showStickyRegister, setShowStickyRegister] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCourseOpen, setMobileCourseOpen] = useState(false);
  const coursesRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  /* ── load active courses ── */
  useEffect(() => {
    setCoursesLoading(true);
    getActiveCourses()
      .then((res) => setCourses(res))
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false));
  }, []);

  /* ── decode token ── */
  useEffect(() => {
    const tok = localStorage.getItem("accessToken");
    if (!tok) return;
    try {
      setAdminUser(jwtDecode(tok));
    } catch {
      /* ignore invalid token */
    }
  }, []);

  /* ── sticky register btn ── */
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

  /* ── close dropdowns on outside click ── */
  useEffect(() => {
    function handleClickOutside(e) {
      if (coursesRef.current && !coursesRef.current.contains(e.target)) {
        setCoursesOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
        setMobileCourseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── close mobile menu on navigation ── */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileCourseOpen(false);
  };

  /* ── prevent body scroll when mobile menu open ── */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { type: "link", to: "/", label: t("Home") },
    { type: "anchor", to: "programs", label: t("OurProgram") },
    { type: "anchor", to: "testimonials", label: t("Testimonials") },
    { type: "anchor", to: "about", label: t("About") },
  ];

  const socialLinks = [
    { href: "https://www.facebook.com/shomesirmath/", icon: FaFacebookF, label: "Facebook" },
    { href: "https://x.com/ShomeSuvad79678", icon: FaTwitter, label: "Twitter" },
    { href: "https://www.instagram.com/maths_ense", icon: FaInstagram, label: "Instagram" },
    { href: "https://www.youtube.com/@mathsenseacademy", icon: FaYoutube, label: "YouTube" },
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
                <a href="tel:+917003416272" className="flex items-center gap-2 hover:text-yellow-300 transition">
                  <Phone size={14} /> +91 70034 16272
                </a>
                <a href="mailto:info@mathsenseacademy.com" className="flex items-center gap-2 hover:text-yellow-300 transition">
                  <Mail size={14} /> info@mathsenseacademy.com
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
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              
              {/* Logo */}
              <motion.div
                layoutId="shared-logo"
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="flex items-center"
              >
                <img
                  src={logo}
                  alt="Math Sense Academy"
                  className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => {
                    navigate("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    closeMobileMenu();
                  }}
                />
              </motion.div>

              {/* Desktop Navigation */}
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

                  {/* Desktop Courses Dropdown */}
                  <li ref={coursesRef} className="relative">
                    <button
                      onClick={() => setCoursesOpen((p) => !p)}
                      className="flex items-center gap-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white hover:text-gray-800 transition-all duration-200 font-medium"
                    >
                      {t("courses")}
                      <ChevronDown size={16} className={`transform transition-transform ${coursesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {coursesOpen && (
                        <motion.ul
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-50"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {coursesLoading ? (
                            <li className="px-4 py-3 text-gray-500">Loading courses...</li>
                          ) : courses.length ? (
                            courses.map((c) => (
                              <li key={c.id}>
                                <Link
                                  to={`/Courses/${c.id}`}
                                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() => setCoursesOpen(false)}
                                >
                                  {c.course_name}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-3 text-gray-500">No courses available</li>
                          )}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                </ul>

                {/* Desktop Auth Button */}
                {adminUser ? (
                  <button
                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                    onClick={() => navigate("/admin")}
                  >
                    Admin Panel
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                    onClick={() => navigate("/Login")}
                  >
                    {t("login")}
                  </button>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              ref={mobileMenuRef}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-stone-900 to-gray-700 z-50 lg:hidden overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="mb-8 pb-6 border-b border-white/20">
                  <h3 className="text-white font-semibold mb-4">Contact Info</h3>
                  <div className="space-y-3">
                    <a href="tel:+917003416272" className="flex items-center gap-3 text-gray-300 hover:text-white transition">
                      <Phone size={16} /> +91 70034 16272
                    </a>
                    <a href="mailto:info@mathsenseacademy.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition">
                      <Mail size={16} /> info@mathsenseacademy.com
                    </a>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mb-8">
                  <h3 className="text-white font-semibold mb-4">Navigation</h3>
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        {item.type === "link" ? (
                          <Link
                            to={item.to}
                            className="block py-3 text-gray-300 hover:text-white transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <a
                            href={`#${item.to}`}
                            className="block py-3 text-gray-300 hover:text-white transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))}

                    {/* Mobile Courses Section */}
                    <li>
                      <button
                        onClick={() => setMobileCourseOpen(!mobileCourseOpen)}
                        className="w-full flex items-center justify-between py-3 text-gray-300 hover:text-white transition-colors"
                      >
                        <span>{t("courses")}</span>
                        <ChevronDown 
                          size={16} 
                          className={`transform transition-transform ${mobileCourseOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {mobileCourseOpen && (
                          <motion.ul
                            className="mt-2 ml-4 space-y-2 pb-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {coursesLoading ? (
                              <li className="py-2 text-gray-400">Loading courses...</li>
                            ) : courses.length ? (
                              courses.map((c) => (
                                <li key={c.id}>
                                  <Link
                                    to={`/Courses/${c.id}`}
                                    className="block py-2 text-gray-400 hover:text-white transition-colors text-sm"
                                    onClick={closeMobileMenu}
                                  >
                                    {c.course_name}
                                  </Link>
                                </li>
                              ))
                            ) : (
                              <li className="py-2 text-gray-400 text-sm">No courses available</li>
                            )}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  </ul>
                </div>

                {/* Auth Button */}
                <div className="mb-8">
                  {adminUser ? (
                    <button
                      className="w-full py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                      onClick={() => {
                        navigate("/admin");
                        closeMobileMenu();
                      }}
                    >
                      Admin Panel
                    </button>
                  ) : (
                    <button
                      className="w-full py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                      onClick={() => {
                        navigate("/Login");
                        closeMobileMenu();
                      }}
                    >
                      {t("login")}
                    </button>
                  )}
                </div>

                {/* Social Links */}
                <div className="border-t border-white/20 pt-6">
                  <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                  <div className="flex items-center gap-4">
                    {socialLinks.map(({ href, icon: Icon, label }) => (
                      <a 
                        key={label}
                        href={href} 
                        target="_blank" 
                        rel="noreferrer" 
                        aria-label={label} 
                        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                      >
                        <Icon size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Sticky Register Btn ── */}
      {showStickyRegister && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 px-5 py-3 font-semibold text-gray-900 bg-yellow-500 rounded-full shadow-lg hover:scale-105 hover:bg-yellow-400 transition z-40"
          onClick={() => setShowRegisterModal(true)}
        >
          {t("hero.registerButton")}
        </motion.button>
      )}

      {/* ── Student Register Modal ── */}
      {showRegisterModal && (
        <StudentRegister onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
};

export default Header;