// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { LayoutGroup } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";

import Header from "./components/layout/Header";
import AdminHeader from "./components/layout/AdminHeader";
import Footer from "./components/layout/Footer";

import Loader from "./components/common/Loader";
import Roles from "./components/common/Roles";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import HelpCenter from "./pages/public/HelpCenter";
import ComingSoonCourses from "./pages/public/ComingSoonCourses";
import BlogList from "./pages/public/BlogList";
import BlogPost from "./pages/public/BlogPost";

import LoginStudent from "./pages/auth/LoginStudent";
import StudentRegister from "./pages/auth/StudentRegister";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminClasses from "./pages/admin/Classes";
import AdminBatches from "./pages/admin/Batches";
import AdminStudentProfile from "./pages/admin/StudentProfile";
import BlogEditor from "./pages/admin/BlogEditor";
import Exam from "./pages/admin/Exam";
import AdminQuestionBankUpload from "./pages/admin/QuestionBankUpload";
import CreateExamFromBank from "./pages/admin/CreateExam";
import ExamList from "./pages/admin/ExamList";

import SdHome from "./pages/student/Dashboard";
import StudentExam from "./pages/student/Exam";

import ClassSection from "./components/features/ClassSection";
import ClassDetails from "./components/features/ClassDetails";
import CourseDetail from "./components/features/CourseDetail";

import useLocoScroll from "./hooks/useLocoScroll";

import "./styles/editor.css";

// Layout for student dashboard pages
function StudentLayout() {
  return (
    <>
      <main className="min-h-[80vh] pt-[80px]">
        <Outlet />
      </main>
    </>
  );
}

// Simple admin route guard
function ProtectedAdminRoute({ children }) {
  const userType = localStorage.getItem("userType");
  return userType === "admin" ? children : <Navigate to="/" />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { scrollRef } = useLocoScroll(!loading);
  const sentinelRef = useRef(null);

  // Loader animation timing
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 6200);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (scrollRef.current?.scrollTo) {
      scrollRef.current.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
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

        {/* Main content area with smooth scroll */}
        <div data-scroll-container ref={scrollRef}>
          <div data-scroll-section className="min-h-screen pt-[80px]">
            <Routes>
              {/* 🏠 Public pages */}
              <Route
                path="/"
                element={
                  <Home sentinelRef={sentinelRef} redirectToLogin={true} />
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/helpCenter" element={<HelpCenter />} />

              {/* 👥 Roles */}
              <Route path="/roles" element={<Roles />} />

              {/* 🔐 Auth */}
              <Route path="/login/student" element={<LoginStudent />} />
              <Route path="/student/login" element={<LoginStudent />} />
              <Route path="/student/register" element={<StudentRegister />} />

              {/* 🎓 Student area */}
              <Route path="/student" element={<StudentLayout />}>
                <Route path="dashboard" element={<SdHome />} />
                <Route path="exam" element={<StudentExam />} />
                <Route path="/student/exam/:examId" element={<StudentExam />} />
              </Route>

              {/* 🧠 Programs / Classes */}
              <Route path="/classs" element={<ClassSection />} />
              <Route path="/class/:classNumber" element={<ClassDetails />} />
              <Route
                path="/class/:classNumber/:courseId"
                element={<CourseDetail />}
              />

              {/* 🧑‍💼 Admin routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/student/:uid"
                element={
                  <ProtectedAdminRoute>
                    <AdminStudentProfile />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/classes"
                element={
                  <ProtectedAdminRoute>
                    <AdminClasses />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/batches"
                element={
                  <ProtectedAdminRoute>
                    <AdminBatches />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/exams"
                element={
                  <ProtectedAdminRoute>
                    <Exam />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/question-bank/upload"
                element={
                  <ProtectedAdminRoute>
                    <AdminQuestionBankUpload />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/exams/create-from-bank"
                element={     
              <ProtectedAdminRoute>
                    <CreateExamFromBank />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/exams"
                element={
                  <ProtectedAdminRoute>
                    <ExamList />
                  </ProtectedAdminRoute>
                }
              />

              {/* 📰 Blogs (Public) */}
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/slug/:slug" element={<BlogPost />} />
              <Route path="/blogs/:id" element={<BlogPost />} />

              {/* 📝 Admin Blog Management */}
              <Route
                path="/admin/blogs"
                element={
                  <ProtectedAdminRoute>
                    <BlogList isAdmin={true} />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/blog/new"
                element={
                  <ProtectedAdminRoute>
                    <BlogEditor mode="create" />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/blog/edit/:id"
                element={
                  <ProtectedAdminRoute>
                    <BlogEditor mode="edit" />
                  </ProtectedAdminRoute>
                }
              />

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
