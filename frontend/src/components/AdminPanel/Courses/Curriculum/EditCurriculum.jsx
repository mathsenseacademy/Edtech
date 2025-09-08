// src/components/AdminPanel/Courses/Curriculum/EditCurriculum.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllCourses,
  getCurriculumById,
  editCurriculum,
} from "../../../../api/courseApi";

export default function EditCurriculum() {
  const { id } = useParams(); // route: /admin/courses/curriculums/edit/:id
  const [curriculumName, setCurriculumName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch courses on mount
  useEffect(() => {
    getAllCourses().then((res) =>
      setCourses(res.data.map((c) => ({ id: c.ID, name: c.course_name })))
    );
  }, []);

  // Fetch curriculum details
  useEffect(() => {
    (async () => {
      try {
        const res = await getCurriculumById({ curriculum_id: Number(id) });
        const data = res.data;
        setCurriculumName(data.curriculum_name);
        setIsActive(data.is_activate === 1);
        const incomingCourseId = data.course_id ?? data.ID;
        setCourseId(String(incomingCourseId));
      } catch (err) {
        setError("Failed to load curriculum details.");
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!courseId) {
      setError("Please select a course.");
      return;
    }
    if (!curriculumName.trim()) {
      setError("Curriculum name cannot be empty.");
      return;
    }

    try {
      await editCurriculum({
        curriculum_id: Number(id),
        curriculum_name: curriculumName.trim(),
        course_id: Number(courseId),
        is_activate: isActive ? 1 : 0,
      });
      navigate("/admin/courses/curriculums");
    } catch (err) {
      setError(err.response?.data || "Update failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Edit Curriculum
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Select Course */}
        <label className="flex flex-col text-sm text-gray-600">
          Select Course
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
            className="mt-2 px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              -- pick a course --
            </option>
            {courses.map((c) => (
              <option
                key={c.id}
                value={c.id}
                className="font-normal"
              >
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {/* Curriculum Name */}
        <label className="flex flex-col text-sm text-gray-600">
          Curriculum Name
          <input
            type="text"
            value={curriculumName}
            onChange={(e) => setCurriculumName(e.target.value)}
            required
            className="mt-2 px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>

        {/* Active Checkbox */}
        <label className="flex items-center gap-2 text-gray-800 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
          Active
        </label>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-md border border-red-600 bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
