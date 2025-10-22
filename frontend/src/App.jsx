// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { LayoutGroup } from "framer-motion";

import Header from "./components/Header";
import AdminHeader from "./components/AdminPanel/AdminHeader";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import StudentRegister from "./pages/StudentRegister";
import AdminDashboard from "./pages/AdminDashboard";
import SdHome from "./pages/Dashboard/SdHome";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Roles from "./components/Roles";
import LoginStudent from "./pages/login/LoginStudent";
import AdminClasses from "./pages/AdminClasses";
import AdminBatches from "./pages/AdminBatches";
import AdminStudentProfile from "./pages/AdminStudentProfile";
import ComingSoonCourses from "./pages/ComingSoonCourses";

import ProgramsSection from "./components/ProgramsSection";
import ClassDetails from "./components/ClassDetails";

import useLocoScroll from "./hooks/useLocoScroll";

function StudentLayout() {
  return (
    <>
      <Header showDashboardBtn={false} />
      <div className="pt-header">
        <Outlet />
      </div>
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
  const path = location.pathname;
  const { scrollRef } = useLocoScroll(!loading);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current?.scrollTo) scrollRef.current.scrollTo(0, 0);
    else window.scrollTo(0, 0);
  }, [location.pathname, scrollRef]);

  const isAdminRoute = path.startsWith("/admin");
  const isStudentRoute = path.startsWith("/student/");
  const userType = localStorage.getItem("userType");

  let HeaderComponent;
  if (isAdminRoute) HeaderComponent = <AdminHeader />;
  else if (!isStudentRoute) {
    HeaderComponent = (
      <Header
        showDashboardBtn={!!userType}
        dashboardTarget={
          userType === "admin" ? "/admin-dashboard" : "/student/dashboard"
        }
      />
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );

  return (
    <LayoutGroup>
      {HeaderComponent}

      <div data-scroll-container ref={scrollRef}>
        <div data-scroll-section className="pt-header">
          <Routes>
            {/* 🏠 Home */}
            <Route
              path="/"
              element={<Home sentinelRef={sentinelRef} redirectToLogin={true} />}
            />

            {/* 👥 Roles */}
            <Route path="/roles" element={<Roles />} />

            {/* 🔐 Logins */}
            <Route path="/login/student" element={<LoginStudent />} />
            <Route path="/student/login" element={<LoginStudent />} />

            {/* 🧾 Student registration */}
            <Route path="/student/register" element={<StudentRegister />} />

            {/* 🎓 Student Dashboard Layout */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<SdHome />} />
            </Route>

            {/* 🧠 Programs / Classes */}
            <Route path="/programs" element={<ProgramsSection />} />
            <Route
              path="/programs/class/:classNumber"
              element={<ClassDetails />}
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
            <Route path="/admin/*" element={<AdminPanel />} />    
<Route path="/admin/student/:uid" element={<AdminStudentProfile />} />
            <Route path="/admin/courses" element={<AdminClasses />} />
            <Route path="/admin/batches" element={<AdminBatches />} />  
            <Route path="/coming-soon" element={<ComingSoonCourses />} />

            {/* 🔁 Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {!isAdminRoute && <Footer />}
        </div>
      </div>
    </LayoutGroup>
  );
}

export default App;
