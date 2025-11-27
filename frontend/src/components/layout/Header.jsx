// src/components/Header.jsx
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
import logo from "../../assets/logoWith_Name.svg";
import StudentRegister from "../../pages/auth/StudentRegister";

const Header = () => {
  const [showStickyRegister, setShowStickyRegister] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const coursesRef = useRef(null);
  const classRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Class data with routes - SEO optimized with proper labels
  const classes = Array.from({ length: 12 }, (_, i) => ({
    name: `Class ${i + 1}`,
    number: i + 1,
    ariaLabel: `Mathematics courses for Class ${i + 1} students`
  }));

  // Course data with routes - SEO optimized
  const courses = [
    { name: "JEE", ariaLabel: "Joint Entrance Examination preparation courses" },
    { name: "UGC", ariaLabel: "University Grants Commission exam preparation" },
    { name: "NET", ariaLabel: "National Eligibility Test preparation" },
    { name: "UPSC", ariaLabel: "Union Public Service Commission exam courses" },
    { name: "WBSC", ariaLabel: "West Bengal Service Commission preparation" },
    { name: "Other Exams", ariaLabel: "Other competitive examination courses" }
  ];

  const { t } = useTranslation();
  const navigate = useNavigate();

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
    { type: "link", to: "/", label: t("Home"), ariaLabel: "Go to homepage" },
    { type: "link", to: "/about", label: t("About"), ariaLabel: "Learn about MathSense Academy" },
    { type: "anchor", to: "testimonials", label: t("Testimonials"), ariaLabel: "Read student testimonials" },
    { type: "link", to: "/blogs", label: t("Blog"), ariaLabel: "Read our educational blog" },
  ];

  const socialLinks = [
    { href: "https://wa.me/9062428472", icon: FaWhatsapp, label: "WhatsApp", ariaLabel: "Contact us on WhatsApp" },
    { href: "https://www.facebook.com/shomesirmath/", icon: FaFacebookF, label: "Facebook", ariaLabel: "Follow us on Facebook" },
    { href: "https://x.com/ShomeSuvad79678", icon: FaTwitter, label: "Twitter", ariaLabel: "Follow us on Twitter" },
    { href: "https://www.instagram.com/maths_ense", icon: FaInstagram, label: "Instagram", ariaLabel: "Follow us on Instagram" },
    { href: "https://www.youtube.com/@mathsenseacademy", icon: FaYoutube, label: "YouTube", ariaLabel: "Subscribe to our YouTube channel" },
    { href: "https://www.linkedin.com/in/suvadip-shome-1817ba289/", icon: FaLinkedinIn, label: "LinkedIn", ariaLabel: "Connect on LinkedIn" }
  ];

  return (
    <>
      {/* ── Fixed Header ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-stone-400 to-gray-800 text-white shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        role="banner"
      >
        {/* Top Info Bar - Desktop Only */}
        <div className="hidden lg:block bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <a
                  href="tel:+919147718572"
                  className="flex items-center gap-2 hover:text-yellow-300 transition"
                  aria-label="Call MathSense Academy at +91 9147718572"
                >
                  <Phone size={14} aria-hidden="true" /> 
                  <span>+91 9147718572</span>
                </a>
                <a
                  href="mailto:info@mathsenseacademy.com"
                  className="flex items-center gap-2 hover:text-yellow-300 transition"
                  aria-label="Email MathSense Academy"
                >
                  <Mail size={14} aria-hidden="true" /> 
                  <span>info@mathsenseacademy.com</span>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span>Follow us:</span>
                {socialLinks.map(({ href, icon: Icon, label, ariaLabel }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    className="hover:text-yellow-300 transition text-sm"
                  >
                    <Icon aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="bg-gradient-to-r from-stone-400 to-gray-800 border-t border-white/10" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
            {/* Logo */}
            <motion.div
              layoutId="shared-logo"
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              className="flex items-center gap-6"
            >
              <img
                src={logo}
                alt="MathSense Academy - Online Math Learning Platform"
                className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
                width="auto"
                height="48"
              />

              {/* Desktop Dropdowns */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Class Dropdown */}
                <div ref={classRef} className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-1 hover:text-yellow-300 font-medium transition"
                    onClick={() => setClassDropdownOpen((prev) => !prev)}
                    aria-expanded={classDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Browse classes from 1 to 12"
                  >
                    {t("Class")}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
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
                        role="menu"
                      >
                        {classes.map((cls) => (
                          <li
                            key={cls.number}
                            role="none"
                          >
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer transition"
                              onClick={() => {
                                navigate(`/class/${cls.number}`);
                                setClassDropdownOpen(false);
                              }}
                              role="menuitem"
                              aria-label={cls.ariaLabel}
                            >
                              {cls.name}
                            </button>
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
                    aria-expanded={courseDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Browse competitive exam courses"
                  >
                    {t("Courses")}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
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
                        role="menu"
                      >
                        {courses.map((course) => (
                          <li
                            key={course.name}
                            role="none"
                          >
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer transition"
                              onClick={() => {
                                navigate("/coming-soon");
                                setCourseDropdownOpen(false);
                              }}
                              role="menuitem"
                              aria-label={course.ariaLabel}
                            >
                              {course.name}
                            </button>
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
                        aria-label={item.ariaLabel}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={`#${item.to}`}
                        className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                        aria-label={item.ariaLabel}
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
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-700 transition"
                aria-label="Student login"
              >
                Login
              </button>
            </div>

            <a
              href="tel:+919147718572"
              className="ml-28 flex text-sm font-medium lg:hidden"
              aria-label="Call us at +91 9147718572"
            >
              <Phone size={16} aria-hidden="true" />
            </a>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </nav>

        {/* Spacer div */}
        <div className="h-[4px] lg:h-[4px]" />

        {/* Student Register Modal */}
        {showRegisterModal && (
          <StudentRegister onClose={() => setShowRegisterModal(false)} />
        )}
      </motion.header>

      {/* Mobile Right-side Drawer (80% width) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Dimmed overlay (left 20%) */}
            <div className="w-1/5" />

            {/* Drawer (right 80%) */}
            <motion.aside
              ref={mobileMenuRef}
              className="w-4/5 h-full overflow-y-auto shadow-2xl"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full bg-gradient-to-b from-white to-gray-100 text-gray-800 p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <img
                    src={logo}
                    alt="MathSense Academy"
                    className="h-10 cursor-pointer"
                    onClick={() => {
                      navigate("/");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setMobileMenuOpen(false);
                    }}
                    width="auto"
                    height="40"
                  />

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close mobile menu"
                    className="p-2 rounded-md hover:bg-gray-200"
                  >
                    <X size={22} aria-hidden="true" />
                  </button>
                </div>

                {/* Contact block */}
                <address className="not-italic mt-6 border rounded-lg p-4 bg-white shadow-sm">
                  <a 
                    href="tel:+919147718572" 
                    className="flex items-center gap-3 text-sm font-medium hover:text-rose-600 transition"
                    aria-label="Call +91 9147718572"
                  >
                    <Phone size={16} aria-hidden="true" />
                    <span>+91 9147718572</span>
                  </a>
                  <a 
                    href="mailto:info@mathsenseacademy.com" 
                    className="flex items-center gap-3 text-sm font-medium mt-2 hover:text-rose-600 transition"
                    aria-label="Email info@mathsenseacademy.com"
                  >
                    <Mail size={16} aria-hidden="true" />
                    <span>info@mathsenseacademy.com</span>
                  </a>

                  <div className="flex items-center gap-3 mt-3">
                    {socialLinks.map(({ href, icon: Icon, label, ariaLabel }) => (
                      <a 
                        key={label} 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={ariaLabel}
                        className="p-1 rounded-md hover:bg-gray-200 transition"
                      >
                        <Icon aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </address>

                <nav className="mt-6 flex-1 overflow-y-auto" aria-label="Mobile navigation">
                  {/* Classes accordion */}
                  <div className="mt-2">
                    <button
                      onClick={() => setClassDropdownOpen((p) => !p)}
                      className="w-full flex items-center justify-between py-3 px-2 font-medium"
                      aria-expanded={classDropdownOpen}
                      aria-label="Browse classes"
                    >
                      <span>{t("Class")}</span>
                      <ChevronDown 
                        size={18} 
                        aria-hidden="true"
                        className={`${classDropdownOpen ? 'rotate-180' : ''} transform transition`} 
                      />
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
                                className="w-full text-left py-2 hover:text-rose-600 transition"
                                onClick={() => {
                                  navigate(`/class/${cls.number}`);
                                  setClassDropdownOpen(false);
                                  setMobileMenuOpen(false);
                                }}
                                aria-label={cls.ariaLabel}
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
                      aria-expanded={courseDropdownOpen}
                      aria-label="Browse courses"
                    >
                      <span>{t("Courses")}</span>
                      <ChevronDown 
                        size={18} 
                        aria-hidden="true"
                        className={`${courseDropdownOpen ? 'rotate-180' : ''} transform transition`} 
                      />
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
                                className="w-full text-left py-2 hover:text-rose-600 transition"
                                onClick={() => {
                                  navigate('/coming-soon');
                                  setCourseDropdownOpen(false);
                                  setMobileMenuOpen(false);
                                }}
                                aria-label={course.ariaLabel}
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
                          <Link 
                            to={item.to} 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="block py-3 font-medium hover:text-rose-600 transition"
                            aria-label={item.ariaLabel}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <a 
                            href={`#${item.to}`} 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="block py-3 font-medium hover:text-rose-600 transition"
                            aria-label={item.ariaLabel}
                          >
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
                    className="w-full px-4 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-700 transition"
                    aria-label="Student login"
                  >
                    Login
                  </button>
                </div>

                <footer className="mt-4 text-xs text-gray-500">
                  © {new Date().getFullYear()} MathSense Academy. All rights reserved.
                </footer>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;