// src/pages/Register.js
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader/DataLoader";

const Register = () => {
  /* ---------- detect "session expired" --------------------------- */
  const { state, search } = useLocation();
  const expiredViaState  = state?.expired;
  const expiredViaQuery  = new URLSearchParams(search).get("expired") === "1";
  const expired          = expiredViaState || expiredViaQuery;

  /* ---------- form state ---------------------------------------- */
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ---------- handlers ------------------------------------------ */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // await api.post("administrator/register/", formData);
      navigate("/"); // or '/login' if that's where you want to land next
    } catch (err) {
      setError("Registration failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- JSX ------------------------------------------------ */
  return (
    <div className="max-w-sm mx-auto mt-8 p-8 border border-gray-300 rounded-lg bg-white shadow-sm">
      {/* ✱ Banner shown only when token has expired */}
      {expired && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          <p className="mb-2">Your session has expired.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
          >
            Log in again
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

      {loading ? (
        <div className="flex justify-center">
          <Loader size={56} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mb-4 p-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-4 p-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mb-4 p-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button 
            type="submit"
            className="bg-indigo-800 text-white p-2.5 border-none rounded cursor-pointer hover:bg-indigo-600 transition-colors font-medium"
          >
            Register
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-2.5">{error}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default Register;