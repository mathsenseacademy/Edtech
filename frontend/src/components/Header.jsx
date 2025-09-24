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
} from "react-icons/fa";
import { Phone, Mail, Menu, X, ChevronDown } from "lucide-react";
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

  /* ── prevent body scroll when mobile menu open ── */
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
  ];

  const socialLinks = [
    { href: "https://wa.me/7003416272", icon: FaWhatsapp, label: "Whatsapp" },
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
                <a
                  href="tel:+917003416272"
                  className="flex items-center gap-2 hover:text-yellow-300 transition"
                >
                  <Phone size={14} /> +91 70034 16272
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
                    setMobileMenuOpen(false);
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

      {/* Spacer div to prevent content being hidden */}
      <div className="h-[120px] lg:h-[150px]" />

      {/* ── Sticky Register Btn ── */}
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

      {/* ── Student Register Modal ── */}
      {showRegisterModal && (
        <StudentRegister onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
};

export default Header;
