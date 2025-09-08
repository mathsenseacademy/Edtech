// src/pages/Login.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api/api";
import Loader from "../components/Loader/DataLoader";

export default function Login() {
  // Admin credentials
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  // Student credentials
  const [studentEmail, setStudentEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [isAdminLogin, setIsAdminLogin] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef(null);

  /* ---------- detect "session expired" --------------------------- */
  const { state, search } = useLocation();
  const expiredViaState  = state?.expired;
  const expiredViaQuery  = new URLSearchParams(search).get("expired") === "1";
  const expired          = expiredViaState || expiredViaQuery;

  useEffect(() => {
    function handleClick(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        // optional: click outside
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isAdminLogin) {
      // Admin login with username & password
      try {
        const { data } = await api.post("administrator/login/", {
          username: adminUsername,
          password: adminPassword,
        });
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("userType", "admin");
        jwtDecode(data.access);
        navigate("/admin");
      } catch {
        setError("Admin login failed. Check your credentials.");
      } finally {
        setLoading(false);
      }
    } else {
      // Student OTP flow
      if (!isOtpSent) {
        try {
          await api.post("student/request_student_login_otp/", {
            email: studentEmail,
          });
          setIsOtpSent(true);
        } catch {
          setError("Unable to send OTP. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const { data } = await api.post(
            "student/verify_student_login_otp/",
            { email: studentEmail, otp }
          );

          // tokens
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          localStorage.setItem("userType", "student");

          // store student profile
          localStorage.setItem("studentProfile", JSON.stringify(data));

          navigate("/student/dashboard");
        } catch {
          setError("OTP verification failed. Please check and try again.");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Background gradient 1 */}
        <div 
          className="absolute -inset-1/2 opacity-50 animate-[slide_3s_ease-in-out_infinite_alternate]"
          style={{
            background: 'linear-gradient(-60deg, #0b6477 50%, #ffbc4d 50%)'
          }}
        />
        {/* Background gradient 2 */}
        <div 
          className="absolute -inset-1/2 opacity-50 animate-[slide_4s_ease-in-out_infinite_alternate-reverse]"
          style={{
            background: 'linear-gradient(-60deg, #0b6477 50%, #ffbc4d 50%)'
          }}
        />
        {/* Background gradient 3 */}
        <div 
          className="absolute -inset-1/2 opacity-50 animate-[slide_5s_ease-in-out_infinite_alternate]"
          style={{
            background: 'linear-gradient(-60deg, #0b6477 50%, #ffbc4d 50%)'
          }}
        />
      </div>

      <form 
        ref={formRef} 
        onSubmit={handleSubmit} 
        className="w-full max-w-sm p-8 rounded-3xl border-2 border-white/30 bg-white/70 backdrop-blur-sm shadow-[inset_0_0_8px_1px_rgba(255,255,255,0.4)]"
      >
        {/* Session expired banner */}
        {expired && (
          <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            <p className="mb-2">Your session has expired.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
            >
              Log in again
            </button>
          </div>
        )}

        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          {isAdminLogin ? "Teacher Login" : "Student Login"}
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader size={56} />
          </div>
        ) : (
          <>
            {isAdminLogin ? (
              // Admin inputs
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                  className="w-full mb-4 p-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="w-full mb-4 p-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </>
            ) : (
              // Student inputs
              <>
                {!isOtpSent && (
                  <input
                    type="email"
                    placeholder="Email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                    className="w-full mb-4 p-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
                {isOtpSent && (
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full mb-4 p-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
              </>
            )}

            {/* Mode toggle before OTP */}
            {(isAdminLogin || !isOtpSent) && (
              <div className="flex items-center mb-4">
                <input
                  id="adminCheck"
                  type="checkbox"
                  checked={isAdminLogin}
                  onChange={(e) => {
                    setIsAdminLogin(e.target.checked);
                    setIsOtpSent(false);
                    setOtp("");
                    setError(null);
                  }}
                  className="mr-2 accent-indigo-600"
                />
                <label htmlFor="adminCheck" className="text-sm text-gray-700 cursor-pointer">
                  Login as Teacher
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-800 text-white p-2.5 border-none rounded cursor-pointer hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : isAdminLogin
                ? "Sign in"
                : isOtpSent
                ? "Verify OTP"
                : "Send OTP"}
            </button>

            {error && (
              <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
            )}

            {isAdminLogin && (
              <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <span
                  className="bg-yellow-700 text-white px-2 py-1 rounded cursor-pointer hover:underline hover:bg-yellow-800 transition-colors"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>
              </p>
            )}
          </>
        )}
      </form>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(25%); }
        }
      `}</style>
    </div>
  );
}