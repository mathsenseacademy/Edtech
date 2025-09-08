import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logoWith_Name.svg';

export default function StudentHeader() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentProfile');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full z-[2000] bg-white dark:bg-gray-900 shadow flex items-center justify-between px-6 h-16">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-auto">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="App Logo" className="w-40 h-20 object-contain" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center text-gray-600 dark:text-gray-300">
        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition ${
              isActive
                ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`
          }
        >
          <span className="material-icons-sharp">dashboard</span>
          <h3 className="text-sm font-medium hidden lg:block">Home</h3>
        </NavLink>

        <NavLink
          to="/student/time-table"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition ${
              isActive
                ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`
          }
        >
          <span className="material-icons-sharp">today</span>
          <h3 className="text-sm font-medium hidden lg:block">Time Table</h3>
        </NavLink>

        <NavLink
          to="/student/examination"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition ${
              isActive
                ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`
          }
        >
          <span className="material-icons-sharp">grid_view</span>
          <h3 className="text-sm font-medium hidden lg:block">Examination</h3>
        </NavLink>

        <NavLink
          to="/student/change-password"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition ${
              isActive
                ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`
          }
        >
          <span className="material-icons-sharp">password</span>
          <h3 className="text-sm font-medium hidden lg:block">Change Password</h3>
        </NavLink>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Profile Button */}
        <button
          id="profile-btn"
          title="Profile"
          className="text-gray-800 dark:text-white text-2xl"
        >
          <span className="material-icons-sharp">person</span>
        </button>

        {/* Theme Toggle */}
        <div
          className="flex items-center w-16 h-7 rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer overflow-hidden"
          onClick={toggleTheme}
        >
          <span
            className={`flex-1 flex items-center justify-center text-lg ${
              !darkMode ? "bg-blue-600 text-white" : "text-gray-500"
            }`}
          >
            light_mode
          </span>
          <span
            className={`flex-1 flex items-center justify-center text-lg ${
              darkMode ? "bg-blue-600 text-white" : "text-gray-500"
            }`}
          >
            dark_mode
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-800 dark:text-white text-2xl"
          title="Logout"
        >
          <span className="material-icons-sharp">logout</span>
        </button>
      </div>
    </header>
  );
}
