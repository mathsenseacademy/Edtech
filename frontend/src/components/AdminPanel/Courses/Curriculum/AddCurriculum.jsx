// src/components/AdminPanel/Courses/AddCurriculum.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";

export default function AddCurriculum() {
  const [curriculumNames, setCurriculumNames] = useState([""]);
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch courses on mount
  useEffect(() => {
    api
      .get("coursemanegment/all_courses_show_public/")
      .then((res) => {
        const normalized = res.data.map((c) => ({
          id: c.ID,
          name: c.course_name,
        }));
        setCourses(normalized);
      })
      .catch(() => setError("Failed to load courses."));
  }, []);

  // Handlers for dynamic fields
  const handleNameChange = (idx, value) => {
    const names = [...curriculumNames];
    names[idx] = value;
    setCurriculumNames(names);
  };

  const addField = () => setCurriculumNames([...curriculumNames, ""]);
  const removeField = (idx) => {
    if (curriculumNames.length === 1) return;
    setCurriculumNames(curriculumNames.filter((_, i) => i !== idx));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!courseId) {
      setError("Please select a course.");
      return;
    }

    try {
      await Promise.all(
        curriculumNames.map((name) =>
          api.post("/coursemanegment/add_course_curriculum/", {
            curriculum_name: name.trim(),
            course_id: Number(courseId),
          })
        )
      );
      navigate("/admin/courses/curriculums");
    } catch (err) {
      setError(err.response?.data || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 rounded-lg bg-white shadow">
      <h2 className="text-2xl font-semibold mb-6">Add New Curriculum</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Course Selector */}
        <div>
          <label className="block font-medium mb-2">Select Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="" disabled>
              -- pick a course --
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Curriculum Names */}
        {curriculumNames.map((name, idx) => (
          <div key={idx} className="relative">
            <label className="block font-medium mb-2">
              Curriculum Name {idx + 1}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(idx, e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
            />
            {curriculumNames.length > 1 && (
              <button
                type="button"
                className="absolute right-2 top-[38px] text-red-600 text-lg"
                onClick={() => removeField(idx)}
              >
                &times;
              </button>
            )}
          </div>
        ))}

        {/* Add More */}
        <button
          type="button"
          onClick={addField}
          className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition"
        >
          + Add Another Curriculum
        </button>

        {/* Error Message */}
        {error && <div className="text-red-600">{error}</div>}

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
        >
          Create Curriculum{curriculumNames.length > 1 ? "s" : ""}
        </button>
      </form>
    </div>
  );
}
