// src/components/AdminPanel/Courses/Essentials.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllCourses,
  getEssentialsById,
  addClassroomEssential,
  editClassroomEssential
} from "../../../../api/courseApi";

export default function EditEssentials() {
  const { essentialsId } = useParams(); 
  const isEdit = Boolean(essentialsId);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [items, setItems] = useState([{ name: "", description: "", ID: null, is_activate: 1 }]);
  const [error, setError] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // load all courses
  useEffect(() => {
    getAllCourses()
      .then(res => setCourses(res.data.map(c => ({ id: c.ID, name: c.course_name }))))
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoadingCourses(false));
  }, []);

  // load existing essentials for this ID
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getEssentialsById({ essentials_id: Number(essentialsId) });
        const data = res.data;
        const rows = Array.isArray(data)
          ? data.map(e => ({
              name: e.classroom_essentials_name,
              description: e.classroom_essentials_description,
              ID: e.ID,
              is_activate: e.is_activate,
              course_id: e.course_id
            }))
          : [{
              name: data.classroom_essentials_name,
              description: data.classroom_essentials_description,
              ID: data.ID,
              is_activate: data.is_activate,
              course_id: data.course_id
            }];
        setItems(rows);
        setSelectedCourse(String(rows[0].course_id));
      } catch {
        setError('Failed to load essentials.');
      }
    })();
  }, [essentialsId, isEdit]);

  const handleCourseChange = e => setSelectedCourse(e.target.value);
  const handleItemChange = (idx, field, value) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    setItems(next);
  };
  const addItem = () => setItems([...items, { name: "", description: "", ID: null, is_activate: 1 }]);
  const removeItem = idx => items.length > 1 && setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!selectedCourse) {
      return setError('Please select a course.');
    }
    try {
      await Promise.all(
        items.map(item => {
          const payload = {
            classroom_essentials_name:         item.name.trim(),
            classroom_essentials_description:  item.description.trim(),
            course_id:                        Number(selectedCourse)
          };
          if (isEdit && item.ID) {
            return editClassroomEssential({
              essentials_id: item.ID,
              ...payload,
              is_activate: item.is_activate ? 1 : 0
            });
          }
          return addClassroomEssential(payload);
        })
      );
      navigate('/admin/courses/essentials');
    } catch {
      setError('Failed to save essentials.');
    }
  };

  // show loader while courses load
  if (loadingCourses) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md font-poppins">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800 text-center">
        {isEdit ? 'Edit' : 'Add'} Classroom Essentials
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Select Course */}
        <label className="flex flex-col text-gray-600 text-sm">
          Select Course
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 focus:border-blue-500 focus:outline-none"
          >
            <option value="" disabled>-- pick a course --</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        {/* Essentials Items */}
        {items.map((item, idx) => (
          <div
            key={idx}
            className="relative grid gap-4 md:grid-cols-2 bg-gray-50 border border-gray-200 rounded-md p-4"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-800 mb-1">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={e => handleItemChange(idx, 'name', e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-800 mb-1">Description</label>
              <textarea
                value={item.description}
                onChange={e => handleItemChange(idx, 'description', e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none resize-y"
              />
            </div>

            {isEdit && item.ID != null && (
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-800">
                <span>Active</span>
                <input
                  type="checkbox"
                  checked={item.is_activate === 1}
                  onChange={e => handleItemChange(idx, 'is_activate', e.target.checked ? 1 : 0)}
                  className="w-4 h-4"
                />
              </label>
            )}

            {items.length > 1 && (
              <button
                type="button"
                className="absolute top-2 right-2 text-red-600 text-xl"
                onClick={() => removeItem(idx)}
              >
                &times;
              </button>
            )}
          </div>
        ))}

        {/* Add button */}
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          + Add Another Essential
        </button>

        {/* Error */}
        {error && (
          <div className="p-3 bg-pink-100 text-red-700 border border-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="justify-self-end px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {isEdit ? 'Update Essentials' : 'Save Essentials'}
        </button>
      </form>
    </div>
  );
}
