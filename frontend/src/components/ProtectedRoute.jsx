// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children, studentOnly = false }) => {
  const token    = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("userType");

  // 1. Must be logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Token must be unexpired
  try {
    const { exp } = jwtDecode(token);
    if (exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userType");
      return <Navigate to="/login" replace state={{ expired: true }} />;
    }
  } catch {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    return <Navigate to="/login" replace />;
  }

  // 3. Role check
  if (studentOnly) {
    // this route is for students only
    if (userType !== "student") {
      return <Navigate to="/login" replace />;
    }
  } else {
    // default: admin-only
    if (userType !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  // 4. All good
  return children;
};

export default ProtectedRoute;
