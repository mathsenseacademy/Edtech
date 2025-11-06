// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { LayoutGroup } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";

import Header from "./components/Header";
import AdminHeader from "./pages/AdminHeader";
import Footer from "./components/Footer";
import Loader from "./components/Loader/Loader";

import Home from "./pages/Home";
import StudentRegister from "./pages/StudentRegister";
import AdminDashboard from "./pages/AdminDashboard";
import SdHome from "./pages/Dashboard/SdHome";
import Roles from "./components/Roles";
import LoginStudent from "./pages/login/LoginStudent";
import AdminClasses from "./pages/AdminClasses";
import AdminBatches from "./pages/AdminBatches";
import AdminStudentProfile from "./pages/AdminStudentProfile";
import ComingSoonCourses from "./pages/ComingSoonCourses";
import About from "./pages/About";

import ClassSection from "./components/ClassSection";
import ClassDetails from "./components/ClassDetails";
import CourseDetail from "./components/CourseDetail";

import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import BlogEditor from "./pages/BlogEditor";

import useLocoScroll from "./hooks/useLocoScroll";

function StudentLayout() {
  return (
    <>
      <Header showDashboardBtn={false} />
      <main className="min-h-[80vh] pt-[80px]"> {/* space for header */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function ProtectedAdminRoute({ children }) {
  const userType = localStorage.getItem("userType");
  return userType === "admin" ? children : <Navigate to="/" />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { scrollRef } = useLocoScroll(!loading);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Wait for loader animation before showing main site
    const timer = setTimeout(() => setLoading(false), 6200); // match your Loader duration
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current?.scrollTo) scrollRef.current.scrollTo(0, 0);
    else window.scrollTo(0, 0);
  }, [location.pathname, scrollRef]);

  const path = location.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const userType = localStorage.getItem("userType");

  const HeaderComponent = isAdminRoute ? (
    <AdminHeader />
  ) : (
    <Header
      showDashboardBtn={!!userType}
      dashboardTarget={
        userType === "admin" ? "/admin-dashboard" : "/student/dashboard"
      }
    />
  );

  if (loading) return <Loader />;

  return (
    <HelmetProvider>
    <LayoutGroup>
      {HeaderComponent}

      {/* Main content area with scroll */}
      <div data-scroll-container ref={scrollRef}>
        <div data-scroll-section className="min-h-screen pt-[80px]">
          <Routes>
            {/* 🏠 Home */}
            <Route
              path="/"
              element={<Home sentinelRef={sentinelRef} redirectToLogin={true} />}
            />
            <Route path="/about" element={<About />} />

            {/* 👥 Roles */}
            <Route path="/roles" element={<Roles />} />

            {/* 🔐 Logins */}
            <Route path="/login/student" element={<LoginStudent />} />
            <Route path="/student/login" element={<LoginStudent />} />

            {/* 🧾 Student registration */}
            <Route path="/student/register" element={<StudentRegister />} />

            {/* 🎓 Student Dashboard */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<SdHome />} />
            </Route>

            {/* 🧠 Programs / Classes */}
            <Route path="/classs" element={<ClassSection />} />
            <Route
              path="/class/:classNumber"
              element={<ClassDetails />}
            />
            <Route path="/class/:classNumber/:courseId" element={<CourseDetail />} />


            {/* 🧑‍💼 Admin routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/admin/student/:uid" element={<AdminStudentProfile />} />
            <Route path="/admin/classes" element={<AdminClasses />} />
            <Route path="/admin/batches" element={<AdminBatches />} />
            <Route path="/admin/blog/new" element={<BlogEditor />} />

            {/* 📰 Blogs */}
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogPost />} />

            {/* 🚧 Coming soon */}
            <Route path="/coming-soon" element={<ComingSoonCourses />} />

            {/* 🔁 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer only for non-admin routes */}
        {!isAdminRoute && <Footer />}
      </div>
    </LayoutGroup>
    </HelmetProvider>
  );
}

export default App;
