// src/components/AdminPanel/Courses/AllCourses.jsx
import { useEffect, useState } from "react";
import { getAllCourses } from "../../../api/courseApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/DataLoader";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses()
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader size={56} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.length ? (
        courses.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-200 rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col min-h-[280px] p-4 cursor-pointer"
            onClick={() => navigate(`/admin/courses/edit/${c.ID}`)}
          >
            <div className="flex-1">
              <h5 className="text-lg font-semibold text-gray-800 mb-2">
                {c.course_name}
              </h5>
              <div className="text-sm text-gray-600">
                <p className="mb-1">
                  <span className="font-medium text-gray-800 block">Class:</span>
                  {c.class_level}
                </p>
              </div>
            </div>
            <div className="mt-3 text-right">
              {c.is_active ? (
                <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-red-500 rounded">
                  Inactive
                </span>
              ) : (
                <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-green-500 rounded">
                  Active
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-600">
          No courses found.
        </p>
      )}
    </div>
  );
}
