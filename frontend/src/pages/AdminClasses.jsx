import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://mathsenseacademy.onrender.com/api/classes";

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form, setForm] = useState({ classNumber: "", title: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  // ✅ Fetch all classes
  const fetchClasses = async () => {
    try {
      const res = await axios.get(API_URL);
      setClasses(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching classes:", err);
      setClasses([]);
    }
  };

  // ✅ Select a class to edit
  const handleSelectClass = (num) => {
    setSelectedClass(num);
    const existing = classes.find((c) => String(c.classNumber) === String(num));
    if (existing) {
      setForm({
        classNumber: existing.classNumber,
        title: existing.title,
        description: existing.description,
      });
    } else {
      setForm({ classNumber: num, title: "", description: "" });
    }
  };

  // ✅ Handle Create/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classNumber) return alert("Select a class first.");
    setLoading(true);

    try {
      await axios.post(API_URL, form);
      await fetchClasses();
      alert("✅ Class saved successfully!");
      setSelectedClass(null);
      setForm({ classNumber: "", title: "", description: "" });
    } catch (err) {
      console.error("❌ Failed to save class:", err);
      alert("Failed to save class.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete class
  const handleDelete = async (num) => {
    if (!window.confirm(`Are you sure you want to delete Class ${num}?`)) return;

    try {
      await axios.delete(`${API_URL}/${num}`);
      await fetchClasses();
      alert(`🗑️ Class ${num} deleted successfully!`);
    } catch (err) {
      console.error("❌ Error deleting class:", err);
      alert("Failed to delete class.");
    }
  };

  return (
    <div className="p-6 mt-16 min-h-screen bg-gradient-to-br from-orange-100 to-amber-200 font-poppins">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        📚 Manage Classes
      </h1>

      {/* --- Class Buttons --- */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-10">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handleSelectClass(num)}
            className={`py-3 rounded-xl shadow-md font-semibold transition-all duration-200 border-2 ${
              selectedClass === num
                ? "bg-indigo-600 text-white border-indigo-700 scale-105"
                : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100 hover:scale-105"
            }`}
          >
            Class {num}
          </button>
        ))}
      </div>

      {/* --- Form Section --- */}
      <AnimatePresence>
        {selectedClass && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 max-w-xl mx-auto space-y-4 mb-12"
          >
            <h2 className="text-xl font-bold text-center text-indigo-700">
              {classes.find((c) => c.classNumber === selectedClass)
                ? `✏️ Edit Class ${selectedClass}`
                : `➕ Add Class ${selectedClass}`}
            </h2>

            <input
              type="text"
              placeholder="Enter Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            <textarea
              placeholder="Enter Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              rows="4"
              required
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                disabled={loading}
              >
                {loading ? "Saving..." : "💾 Save"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* --- Class Cards --- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No classes available yet.
          </p>
        ) : (
          classes.map((cls, i) => (
            <motion.div
              key={`${cls.classNumber}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl border border-indigo-100 transition-all flex flex-col justify-between relative"
            >
              <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                Class {cls.classNumber}
              </span>

              <div className="mt-4">
                <h2 className="font-bold text-lg text-indigo-800 mb-1">
                  {cls.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-4">{cls.description}</p>
              </div>

              <div className="mt-5 flex justify-between items-center">
                <button
                  onClick={() => handleSelectClass(cls.classNumber)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(cls.classNumber)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminClasses;
