// src/pages/LoginStudent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../../firebase/firebaseconfig"; 

const auth = getAuth(app);

// API Configuration - make sure this matches your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-bqojuh5xfq-uc.a.run.app';

export default function LoginStudent() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // FIXED: Check if student exists in your backend database
  const checkStudentExists = async (user) => {
    try {
      console.log('🔍 Checking if student exists...');
      console.log('👤 User UID:', user.uid);
      console.log('📧 User Email:', user.email);
      
      const response = await fetch(
        `${API_BASE_URL}/api/student/check-registration?google_uid=${encodeURIComponent(user.uid)}&email=${encodeURIComponent(user.email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('🌐 Response status:', response.status);
      console.log('🌐 Response OK:', response.ok);
      
      if (!response.ok) {
        console.error('❌ HTTP error:', response.status);
        // If server error, assume student doesn't exist
        return false;
      }
      
      const data = await response.json();
      console.log('📊 Response data:', data);
      
      // Check if student exists and registration is complete
      const isRegistered = data.exists === true && data.is_registered === true;
      console.log('✅ Is registered:', isRegistered);
      
      return isRegistered;
    } catch (error) {
      console.error("🚨 Error checking student existence:", error);
      return false;
    }
  };

  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isNewUser) {
        // Email signup - create new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const token = await userCredential.user.getIdToken();

        localStorage.setItem("accessToken", token);
        localStorage.setItem("userType", "student");
        localStorage.setItem("studentUid", userCredential.user.uid);

        // For new email signup, always go to registration
        navigate("/student/register");
      } else {
        // Email login - sign in existing user
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const token = await userCredential.user.getIdToken();

        localStorage.setItem("accessToken", token);
        localStorage.setItem("userType", "student");
        localStorage.setItem("studentUid", userCredential.user.uid);

        // Check if student is registered in your backend
        const studentExists = await checkStudentExists(userCredential.user);
        
        if (studentExists) {
          console.log("✅ Student exists, redirecting to dashboard");
          navigate("/student/dashboard");
        } else {
          console.log("❌ Student needs to register");
          // Store basic user data for registration
          const authData = {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            uid: userCredential.user.uid,
            photoURL: userCredential.user.photoURL
          };
          sessionStorage.setItem("googleAuthData", JSON.stringify(authData));
          navigate("/student/register");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // 🔒 Check for admin email
    const adminEmails = ["mathsenseacademy@gmail.com"]; // ✅ add more if needed
    if (adminEmails.includes(user.email)) {
      console.log("🧑‍🏫 Admin detected, redirecting to admin dashboard...");
      localStorage.setItem("accessToken", "admin-access-token");
      localStorage.setItem("userType", "admin");
      localStorage.setItem("adminEmail", user.email);
      navigate("/admin-dashboard");
      return;
    }

      localStorage.setItem("accessToken", token);
      localStorage.setItem("userType", "student");
      localStorage.setItem("studentUid", user.uid);

      console.log("🔐 Google auth successful, checking if student exists...");

      // Check if student is already registered in your backend
      const studentExists = await checkStudentExists(user);
      
      if (studentExists) {
        console.log("✅ Existing student, redirecting to dashboard");
        navigate("/student/dashboard");
      } else {
        console.log("❌ New student, redirecting to registration");
        // Store Google auth data for registration
        const googleAuthData = {
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL
        };
        
        sessionStorage.setItem("googleAuthData", JSON.stringify(googleAuthData));
        navigate("/student/register");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Student Login
        </h2>

        {/* Primary Google Auth Button */}
        <div className="mb-6">
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Checking..." : "Continue with Google"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Divider */}
        {/* <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div> */}

        {/* Email/Password Auth Form */}
        {/* <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /> */}

          {/* <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> */}

          {/* <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Please wait..." : isNewUser ? "Sign Up with Email" : "Login with Email"}
          </button>
        </form> */}

        {/* <p className="mt-6 text-center text-sm text-gray-600">
          {isNewUser ? "Already have an account?" : "New here?"}{" "}
          <span
            onClick={() => setIsNewUser(!isNewUser)}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            {isNewUser ? "Login" : "Sign Up"}
          </span>
        </p> */}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">How it works</h4>
              <p className="text-xs text-blue-700">
                Login with your Google account. New students will be redirected to complete registration. Existing students will go directly to their dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}