// src/components/AdminPanel/Courses/CourseForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  createCourse,
  editCourse,
  getVerifiedStudents,
  getAllClassLevels,
  getAllCategoryLevels,
} from "../../../api/courseApi";
import Loader from "../../Loader/DataLoader";

export default function CourseForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [f, setF] = useState({
    course_name: "",
    course_subtitle: "",
    course_image_path: "", // will hold base64 or URL
    course_video_path: "",
    student_id_of_the_week: "",
    class_level_id: "",
    category_id: "",
    show_in_forntpage: 0,
    isActive: 1,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [students, setStudents] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [categories, setCategories] = useState([]);

  // helper to convert file => base64 for new uploads
  const imageToBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        // load dropdowns
        const [stuRes, lvlRes, catRes] = await Promise.all([
          getVerifiedStudents(),
          getAllClassLevels(),
          getAllCategoryLevels(),
        ]);
        setStudents(stuRes.data);
        setClassLevels(lvlRes.data);
        setCategories(catRes.data);

        // if editing, fetch the existing course
        if (isEditMode) {
          const courseRes = await getCourseById(id);
          const c = Array.isArray(courseRes.data)
            ? courseRes.data[0]
            : courseRes.data;

          setF({
            course_name: c.course_name || "",
            course_subtitle: c.course_subtitle || "",
            course_image_path: c.course_image_path || "",
            course_video_path: c.course_video_path || "",
            student_id_of_the_week: c.student_id_of_the_week
              ? String(c.student_id_of_the_week)
              : "",
            class_level_id: c.class_level_id ? String(c.class_level_id) : "",
            category_id: c.category_id ? String(c.category_id) : "",
            show_in_forntpage: Number(c.show_in_forntpage) || 0,
            isActive: Number(c.isActive) !== 0 ? 1 : 0,
          });

          // show existing image (could be URL or base64)
          setImagePreview(c.course_image_path || "");
        }
      } catch (err) {
        console.error("Error loading form data:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, isEditMode]);

  const update = async (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file" && files?.[0]) {
      // new upload: convert to base64 and preview
      const base64 = await imageToBase64(files[0]);
      setF((p) => ({ ...p, [name]: base64 }));
      setImagePreview(base64);
    } else {
      // normal field / checkbox
      setF((p) => ({
        ...p,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...f,
      student_id_of_the_week: Number(f.student_id_of_the_week),
      class_level_id: Number(f.class_level_id),
      category_id: Number(f.category_id),
      show_in_forntpage: Number(f.show_in_forntpage),
      isActive: Number(f.isActive),
      ...(isEditMode && { id: Number(id) }),
    };

    try {
      if (isEditMode) await editCourse(payload);
      else await createCourse(payload);
      alert(isEditMode ? "Course updated!" : "Course created!");
      navigate("/admin/courses/all");
    } catch (err) {
      console.error("Submission error:", err);
      alert(isEditMode ? "Failed to update course" : "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Loader size={56} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 600 }}>
      <h2>{isEditMode ? "Edit Course" : "Create Course"}</h2>

      {/* Course Name */}
      <div className="mb-3">
        <label className="form-label">Course Name</label>
        <input
          name="course_name"
          value={f.course_name}
          onChange={update}
          className="form-control"
          required
        />
      </div>

      {/* Course Subtitle */}
      <div className="mb-3">
        <label className="form-label">Course Subtitle</label>
        <input
          name="course_subtitle"
          value={f.course_subtitle}
          onChange={update}
          className="form-control"
          required
        />
      </div>

      {/* Course Image */}
      <div className="mb-3">
        <label className="form-label">Course Image</label>
        <input
          type="file"
          accept="image/*"
          name="course_image_path"
          onChange={update}
          className="form-control"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "20%", borderRadius: 4 }}
            />
          </div>
        )}
      </div>

      {/* Course Video URL */}
      <div className="mb-3">
        <label className="form-label">Course Video URL</label>
        <input
          name="course_video_path"
          value={f.course_video_path}
          onChange={update}
          className="form-control"
        />
      </div>

      {/* Student of the Week */}
      <div className="mb-3">
        <label className="form-label">Student of the Week</label>
        <select
          name="student_id_of_the_week"
          value={f.student_id_of_the_week}
          onChange={update}
          className="form-select"
          
        >
          <option value="">Select...</option>
          {students.map((s) => (
            <option key={s.ID} value={s.ID}>
              {[s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ")}
            </option>
          ))}
        </select>
      </div>

      {/* Class Level */}
      <div className="mb-3">
        <label className="form-label">Class Level</label>
        <select
          name="class_level_id"
          value={f.class_level_id}
          onChange={update}
          className="form-select"
          required
        >
          <option value="">Select...</option>
          {classLevels.map((c) => (
            <option key={c.ID} value={c.ID}>
              {c.class_name}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          name="category_id"
          value={f.category_id}
          onChange={update}
          className="form-select"
          required
        >
          <option value="">Select...</option>
          {categories.map((cat) => (
            <option key={cat.ID} value={cat.ID}>
              {cat.cetagory_name}
            </option>
          ))}
        </select>
      </div>

      {/* Toggles */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          name="show_in_forntpage"
          checked={f.show_in_forntpage === 1}
          onChange={update}
          className="form-check-input"
          id="showFront"
        />
        <label className="form-check-label" htmlFor="showFront">
          Show on Front Page
        </label>
      </div>
      <div className="form-check mb-3">
        <input
          type="checkbox"
          name="isActive"
          checked={f.isActive === 1}
          onChange={update}
          className="form-check-input"
          id="isActive"
        />
        <label className="form-check-label" htmlFor="isActive">
          Active
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? <Loader size={20} /> : isEditMode ? "Save Changes" : "Create Course"}
      </button>
    </form>
  );
}
