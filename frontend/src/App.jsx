import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LayoutGroup } from "framer-motion";

import Header          from "./components/Header";
import AdminHeader     from "./components/AdminPanel/AdminHeader";
import StudentHeader   from "./components/StudentHeader";
import Footer          from "./components/Footer";

import Home            from "./pages/Home";
import Register        from "./pages/Register";
import StudentRegister from "./pages/StudentRegister";
import Login           from "./pages/Login";
import CoursePage      from "./pages/CoursePage";
import AdminPanel      from "./components/AdminPanel/AdminPanel";
import ProtectedRoute  from "./components/ProtectedRoute";

import useLocoScroll   from "./hooks/useLocoScroll";
import { SdTimeTable } from "./pages/StudentDashboard/SdTimeTable/SdTimeTable";
import { SdExamination } from "./pages/StudentDashboard/SdExamination/SdExamination";
import { SdChangePassword } from "./pages/StudentDashboard/SdChangePassword/SdChangePassword";
import { SdHome } from "./pages/StudentDashboard/SdHome";

function App() {
  // ── 1. Loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  // ── 2. Location + scroll container + sentinel
  const location    = useLocation();
  const path        = location.pathname;
  const { scrollRef } = useLocoScroll(!loading);
  const sentinelRef = useRef(null);

  // ── 3. Always snap to top on route change
  useEffect(() => {
    if (scrollRef.current?.scrollTo) {
      scrollRef.current.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, scrollRef]);

  // ── 4. Early return while loading
  if (loading) return <Loader />;

  // ── 5. Route flags
  const isAdminRoute    = path.startsWith("/admin");
  const isStudentRoute  = path.startsWith("/student/");
  const isRoot          = path === "/";
  const isCoursePage    = path.startsWith("/courses/");
  const isLoginRoute    = path === "/login";
  const isRegisterRoute = path === "/register" || path === "/student/register";
  const forceShowAuthBar = isLoginRoute || isRegisterRoute;
  const userType = localStorage.getItem("userType");

  // ── 6. Pick the right header
  let HeaderComponent;
  if (isAdminRoute) {
    HeaderComponent = <AdminHeader />;
  } else if (isStudentRoute) {
    HeaderComponent = <StudentHeader />;
  } else {
    HeaderComponent = (
      <Header
        showDashboardBtn={isRoot && !!userType}
        dashboardTarget={userType === "admin" ? "/admin" : "/student/dashboard"}
      />
    );
  }

  return (
    <LayoutGroup>

      {HeaderComponent}

      <div data-scroll-container ref={scrollRef}>
        <div data-scroll-section className="pt-header">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home sentinelRef={sentinelRef} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student/register" element={<StudentRegister />} />

            <Route path="/student/dashboard" element={
              <ProtectedRoute studentOnly>
                  <SdHome />
              </ProtectedRoute>
            }/>
            <Route path="/student/time-table" element={
              <ProtectedRoute studentOnly>
                <SdTimeTable />
              </ProtectedRoute>
            } />
            <Route path="/student/examination" element={
              <ProtectedRoute studentOnly>
                <SdExamination />
              </ProtectedRoute>
            } />
            <Route path="/student/change-password" element={
              <ProtectedRoute studentOnly>
                <SdChangePassword />
              </ProtectedRoute>
            } />

            <Route path="/courses/:id" element={<CoursePage sentinelRef={sentinelRef} />}/>

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>

          {(!isAdminRoute && !isStudentRoute) && <Footer />}
        </div>
      </div>
    </LayoutGroup>
  );
}

export default App;
