import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://api-bqojuh5xfq-uc.a.run.app/api/classes";

const classGroups = [
  { label: "Class 1-2", range: "1-2" },
  { label: "Class 3-4", range: "3-4" },
  ...Array.from({ length: 8 }, (_, i) => ({
    label: `Class ${i + 5}`,
    range: `${i + 5}`,
  })),
];

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({
    classRange: "",
    title: "",
    description: "",
    topics: [],
    courseType: false,
    purpose: "",
    suggestedBooks: [],
    active: true,
  });
  const [newTopic, setNewTopic] = useState("");
  const [newBook, setNewBook] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(API_URL);
      const safeData = (res.data || []).map((c) => ({
        ...c,
        topics: Array.isArray(c.topics) ? c.topics : [],
        suggestedBooks: Array.isArray(c.suggestedBooks) ? c.suggestedBooks : [],
      }));
      setClasses(safeData);
    } catch (err) {
      console.error("❌ Error fetching classes:", err);
      setClasses([]);
    }
  };

  const handleSelectRange = (range) => {
    setSelectedRange(range);
    setSelectedCourse(null);
    resetForm(range);
    setMessage("");
  };

  const resetForm = (range) => {
    setForm({
      classRange: range,
      title: "",
      description: "",
      topics: [],
      courseType: false,
      purpose: "",
      suggestedBooks: [],
      active: true,
    });
    setNewTopic("");
    setNewBook("");
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setForm({ ...course });
    setMessage("");
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setForm({ ...form, topics: [...(form.topics || []), newTopic.trim()] });
      setNewTopic("");
    }
  };

  const handleAddBook = () => {
    if (newBook.trim()) {
      setForm({
        ...form,
        suggestedBooks: [...(form.suggestedBooks || []), newBook.trim()],
      });
      setNewBook("");
    }
  };

  const handleRemoveItem = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm({ ...form, [field]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classRange) return;
    setLoading(true);
    try {
      if (selectedCourse) {
        // Update existing course
        await axios.put(`${API_URL}/${selectedCourse.id}`, form);
        setMessage(`✅ Updated course "${form.title}" successfully`);
      } else {
        // Create new course
        await axios.post(API_URL, form);
        setMessage(`✅ Created new course for ${form.classRange}`);
      }
      await fetchClasses();
      resetForm(form.classRange);
      setSelectedCourse(null);
    } catch (err) {
      console.error("❌ Error saving course:", err);
      setMessage("❌ Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${API_URL}/${courseId}`);
      setMessage("🗑️ Course deleted successfully.");
      await fetchClasses();
    } catch (err) {
      console.error("❌ Error deleting course:", err);
      setMessage("❌ Failed to delete course.");
    }
  };

  const filteredCourses = classes.filter(
    (c) => c.classRange === selectedRange
  );

  return (
    <div className="p-6 mt-16 min-h-screen bg-gradient-to-br from-orange-100 to-amber-200 font-poppins">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        📚 Manage Class Courses
      </h1>

      {message && (
        <p
          className={`text-center mb-6 font-medium ${
            message.startsWith("✅") || message.startsWith("🗑️")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* --- Class Buttons --- */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-10">
        {classGroups.map((group) => (
          <button
            key={group.range}
            onClick={() => handleSelectRange(group.range)}
            className={`py-3 rounded-xl shadow-md font-semibold transition-all duration-200 border-2 ${
              selectedRange === group.range
                ? "bg-indigo-600 text-white border-indigo-700 scale-105"
                : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100 hover:scale-105"
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* --- Courses List --- */}
      {selectedRange && (
        <div className="max-w-3xl mx-auto mb-8">
          <h3 className="text-xl font-semibold mb-3 text-indigo-700">
            Existing Courses for {selectedRange}
          </h3>
          {filteredCourses.length === 0 ? (
            <p className="text-gray-500">No courses yet for this class.</p>
          ) : (
            <div className="space-y-3">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex justify-between items-center bg-white rounded-lg shadow p-3 border border-gray-100"
                >
                  <div>
                    <h4 className="font-bold text-indigo-700">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {course.description.slice(0, 80)}...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- Add/Edit Form --- */}
      <AnimatePresence>
        {selectedRange && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 max-w-xl mx-auto space-y-4 mb-12"
          >
            <h2 className="text-xl font-bold text-center text-indigo-700">
              {selectedCourse
                ? `✏️ Edit: ${selectedCourse.title}`
                : `➕ Add New Course for ${selectedRange}`}
            </h2>

            <input
              type="text"
              placeholder="Enter Course Name"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            <textarea
              placeholder="Enter Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              rows="3"
              required
            />

            <textarea
              placeholder="Purpose (optional)"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              rows="2"
            />

            {/* Course Type */}
            <div className="flex items-center gap-3">
              <label className="font-medium">Course Type:</label>
              <select
                value={form.courseType ? "long" : "short"}
                onChange={(e) =>
                  setForm({ ...form, courseType: e.target.value === "long" })
                }
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="short">Short</option>
                <option value="long">Long</option>
              </select>
            </div>

            {/* Topics */}
            <div>
              <label className="font-medium">Topics:</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Add a topic"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="bg-indigo-500 text-white px-4 rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(form.topics || []).map((t, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("topics", i)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Books */}
            <div>
              <label className="font-medium">Suggested Books:</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Add a book"
                  value={newBook}
                  onChange={(e) => setNewBook(e.target.value)}
                  className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddBook}
                  className="bg-indigo-500 text-white px-4 rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(form.suggestedBooks || []).map((b, i) => (
                  <span
                    key={i}
                    className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {b}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("suggestedBooks", i)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <span className="font-medium">Active</span>
            </div>

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
                onClick={() => {
                  setSelectedCourse(null);
                  resetForm(selectedRange);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
