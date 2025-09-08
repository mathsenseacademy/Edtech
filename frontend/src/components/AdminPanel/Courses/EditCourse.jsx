// src/components/AdminPanel/Courses/EditCourse.jsx
import { useEffect, useState } from "react";
import { getCourseById, editCourse } from "../../../api/courseApi";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../Loader/DataLoader";

export default function EditCourse() {
  const { id } = useParams();               // must match route `:id`
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    course_ID:   Number(id),
    course_name: "",
    class_level: "",
    category:    "",
    focus_area:  "",
    is_active:   1,                         // default to active
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getCourseById(Number(id))
      .then(({ data }) => {
        console.log("Raw showCourse response:", data);
        // Normalize array or nested results
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        if (!items.length) throw new Error("No course data returned");
        const record = items[0];
        setCourse({
          course_ID:   record.course_ID,
          course_name: record.course_name,
          class_level: record.class_level,
          category:    record.category,
          focus_area:  record.focus_area,
          is_active:   record.is_active ?? 1,
        });
      })
      .catch((err) => {
        console.error("Failed to load course for editing:", err);
        alert("Course not found");
        navigate("/admin/courses");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Loader size={56} />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((c) => ({
      ...c,
      [name]: name === "is_active" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await editCourse({
        course_ID:   course.course_ID,
        // course_name: course.course_name.trim(),
        // class_level: course.class_level.trim(),
        // category:    course.category.trim(),
        // focus_area:  course.focus_area.trim(),
        is_active:   course.is_active,
      });
      alert("Course updated!");
      navigate("/admin/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto"
      style={{ maxWidth: 600 }}
    >
      <h2>Edit Course #{course.course_ID}</h2>

      <div className="mb-3">
        <label className="form-label">Course Name</label>
        <input
          type="text"
          name="course_name"
          className="form-control"
          value={course.course_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Class Level</label>
        <input
          type="text"
          name="class_level"
          className="form-control"
          value={course.class_level}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <input
          type="text"
          name="category"
          className="form-control"
          value={course.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Focus Area</label>
        <textarea
          name="focus_area"
          className="form-control"
          value={course.focus_area}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Active?</label>
        <select
          name="is_active"
          className="form-select"
          value={course.is_active}
          onChange={handleChange}
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
      </div>

      <button className="btn btn-primary" disabled={saving}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
