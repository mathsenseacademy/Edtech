// src/components/AdminPanel/StudentEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import Loader from "../Loader/DataLoader";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [saving, setSaving] = useState(false);

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post("student/student_detail_by_id/", {
          student_id: parseInt(id, 10),
        });
        setStudent(data);
      } catch (err) {
        console.error("Error loading student:", err);
      } finally {
        setLoadingStudent(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(
          "coursemanegment/all_courses_show_public/"
        );
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    })();

    (async () => {
      try {
        const { data } = await api.get(
          "batchmanegment/all_batches_with_schedule/"
        );
        setBatches(data);
      } catch (err) {
        console.error("Failed to load batches:", err);
      } finally {
        setLoadingBatches(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        student_id: parseInt(id, 10),
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        email: student.email,
        contact_number_1: student.contact_number_1,
        contact_number_2: student.contact_number_2,
        student_class: student.student_class,
        school_or_college_name: student.school_or_college_name,
        board_or_university_name: student.board_or_university_name,
        address: student.address,
        city: student.city,
        district: student.district,
        state: student.state,
        pin: student.pin,
        notes: student.notes,
        is_verified: student.is_verified,
        is_activate: student.is_active, // backend expects is_activate
        date_of_birth: student.date_of_birth,
        student_photo_path: student.student_photo_path,
        batch_id: student.batch_id,
      };

      await api.post("student/update_student_detail/", payload);
      navigate(-1);
    } catch (err) {
      console.error("Error saving student:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loadingStudent) return <Loader size={56} />;
  if (!student) return <p>Student not found</p>;

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Edit Student:{" "}
        {[student.first_name, student.middle_name, student.last_name]
          .filter(Boolean)
          .join(" ")}
      </h2>

      {student.student_photo_path && (
        <div className="flex justify-center mb-4">
          <img
            src={student.student_photo_path}
            alt="Student"
            className="w-32 h-32 object-cover rounded-lg shadow"
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
      >
        {/* First Name */}
        <label className="flex flex-col text-sm text-gray-600">
          First Name
          <input
            name="first_name"
            value={student.first_name || ""}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Middle Name */}
        <label className="flex flex-col text-sm text-gray-600">
          Middle Name
          <input
            name="middle_name"
            value={student.middle_name || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Last Name */}
        <label className="flex flex-col text-sm text-gray-600">
          Last Name
          <input
            name="last_name"
            value={student.last_name || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Email */}
        <label className="flex flex-col text-sm text-gray-600">
          Email
          <input
            type="email"
            name="email"
            value={student.email || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Contact #1 */}
        <label className="flex flex-col text-sm text-gray-600">
          Contact #1
          <input
            type="tel"
            name="contact_number_1"
            value={student.contact_number_1 || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Contact #2 */}
        <label className="flex flex-col text-sm text-gray-600">
          Contact #2
          <input
            type="tel"
            name="contact_number_2"
            value={student.contact_number_2 || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Class dropdown */}
        <label className="flex flex-col text-sm text-gray-600">
          Class
          {loadingCourses ? (
            <select
              disabled
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            >
              <option>Loading classes…</option>
            </select>
          ) : (
            <select
              name="student_class"
              value={student.student_class || ""}
              onChange={handleChange}
              required
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select a class</option>
              {courses.map((c) => (
                <option key={c.ID} value={c.ID}>
                  {`${c.msa_class_level} (${c.course_name})`}
                </option>
              ))}
            </select>
          )}
        </label>

        {/* School / College */}
        <label className="flex flex-col text-sm text-gray-600">
          School / College
          <input
            name="school_or_college_name"
            value={student.school_or_college_name || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Board / University */}
        <label className="flex flex-col text-sm text-gray-600">
          Board / University
          <input
            name="board_or_university_name"
            value={student.board_or_university_name || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Batches dropdown */}
        <label className="flex flex-col text-sm text-gray-600">
          Batches
          {loadingBatches ? (
            <select
              disabled
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            >
              <option>Loading batches…</option>
            </select>
          ) : (
            <select
              name="batch_id"
              value={student.batch_id || ""}
              onChange={handleChange}
              required
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select a batch</option>
              {batches.map((c) => (
                <option key={c.batch_id} value={c.batch_id}>
                  {c.batch_name}
                </option>
              ))}
            </select>
          )}
        </label>

        {/* Address */}
        <label className="flex flex-col text-sm text-gray-600 col-span-full">
          Address
          <textarea
            name="address"
            value={student.address || ""}
            onChange={handleChange}
            rows={2}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
          />
        </label>

        {/* City */}
        <label className="flex flex-col text-sm text-gray-600">
          City
          <input
            name="city"
            value={student.city || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* District */}
        <label className="flex flex-col text-sm text-gray-600">
          District
          <input
            name="district"
            value={student.district || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* State */}
        <label className="flex flex-col text-sm text-gray-600">
          State
          <input
            name="state"
            value={student.state || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* PIN */}
        <label className="flex flex-col text-sm text-gray-600">
          PIN
          <input
            type="number"
            name="pin"
            value={student.pin || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Notes */}
        <label className="flex flex-col text-sm text-gray-600 col-span-full">
          Notes
          <textarea
            name="notes"
            value={student.notes || ""}
            onChange={handleChange}
            rows={3}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
          />
        </label>

        {/* Date of Birth */}
        <label className="flex flex-col text-sm text-gray-600">
          Date of Birth
          <input
            type="date"
            name="date_of_birth"
            value={student.date_of_birth || ""}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </label>

        {/* Active */}
        <label className="flex flex-col text-sm text-gray-600">
          Active?
          <input
            type="checkbox"
            name="is_active"
            checked={!!student.is_active}
            onChange={handleChange}
            className="mt-1 w-5 h-5"
          />
        </label>

        {/* Verified */}
        <label className="flex flex-col text-sm text-gray-600">
          Verified?
          <input
            type="checkbox"
            name="is_verified"
            checked={!!student.is_verified}
            onChange={handleChange}
            className="mt-1 w-5 h-5"
          />
        </label>

        {/* Buttons */}
        <div className="col-span-full flex justify-end gap-4 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-md font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow"
          >
            {saving ? "Saving…" : "Update"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 shadow"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
