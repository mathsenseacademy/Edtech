import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../../api/api";

export default function AllCurriculums() {
  const [curricula, setCurricula] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/coursemanegment/show_all_curriculums/")
      .then((res) => setCurricula(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load curricula.");
      });
  }, []);

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-xl border border-gray-200 shadow">
      <h2 className="text-2xl font-semibold mb-4">All Curriculums</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Curriculum Name</th>
            <th className="p-3 border">Course ID</th>
            <th className="p-3 border">Active?</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {curricula.map((item) => (
            <tr
              key={item.curriculum_id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="p-3 border">{item.curriculum_id}</td>
              <td className="p-3 border">{item.curriculum_name}</td>
              <td className="p-3 border">{item.ID}</td>
              <td className="p-3 border">
                {item.is_activate ? "Yes" : "No"}
              </td>
              <td className="p-3 border flex gap-2">
                <Link
                  to={`/admin/courses/curriculums/edit/${item.curriculum_id}`}
                  className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                >
                  Edit
                </Link>
                <button
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
                  onClick={() => {
                    if (window.confirm("Delete this curriculum?")) {
                      api
                        .delete(
                          `/coursemanegment/delete_curriculum/${item.curriculum_id}/`
                        )
                        .then(() =>
                          setCurricula(
                            curricula.filter(
                              (c) => c.curriculum_id !== item.curriculum_id
                            )
                          )
                        )
                        .catch(() => alert("Delete failed."));
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
