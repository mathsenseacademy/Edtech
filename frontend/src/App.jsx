import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { LayoutGroup } from "framer-motion";

import Header from "./components/Header";
import AdminHeader from "./components/AdminPanel/AdminHeader";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import StudentRegister from "./pages/StudentRegister";
import SdHome from "./pages/Dashboard/SdHome";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Roles from "./components/Roles";
import LoginStudent from "./pages/login/LoginStudent";

import useLocoScroll from "./hooks/useLocoScroll";

// Optional: ProtectedRoute if needed
// import ProtectedRoute from "./components/ProtectedRoute";

// ── Student layout to wrap all student dashboard routes
function StudentLayout() {
  return (
    <>
      <Header showDashboardBtn={false} /> {/* Or use StudentHeader component */}
      <div className="pt-header">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const path = location.pathname;
  const { scrollRef } = useLocoScroll(!loading);
  const sentinelRef = useRef(null);

  // Loading spinner
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (scrollRef.current?.scrollTo) {
      scrollRef.current.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, scrollRef]);

  // Pick header
  const isAdminRoute = path.startsWith("/admin");
  const isStudentRoute = path.startsWith("/student/");
  const userType = localStorage.getItem("userType");

  let HeaderComponent;
  if (isAdminRoute) HeaderComponent = <AdminHeader />;
  else if (!isStudentRoute) {
    HeaderComponent = (
      <Header
        showDashboardBtn={!!userType}
        dashboardTarget={userType === "admin" ? "/admin" : "/student/dashboard"}
      />
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <LayoutGroup>
      {HeaderComponent}

      <div data-scroll-container ref={scrollRef}>
        <div data-scroll-section className="pt-header">
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home sentinelRef={sentinelRef} redirectToLogin={true} />} />

            {/* Roles */}
            <Route path="/roles" element={<Roles />} />

            {/* Logins */}
            <Route path="/login/student" element={<LoginStudent />} />
            <Route path="/student/login" element={<LoginStudent />} />

            {/* Student registration */}
            <Route path="/student/register" element={<StudentRegister />} />

            {/* ── Student Dashboard Routes ── */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<SdHome />} />
              {/* future nested routes can go here */}
              {/* <Route path="time-table" element={<SdTimeTable />} /> */}
              {/* <Route path="examination" element={<SdExamination />} /> */}
              {/* <Route path="change-password" element={<SdChangePassword />} /> */}
            </Route>

            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </LayoutGroup>
  );
}

export default App;
