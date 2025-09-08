import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllClassroomEssentials,
  deleteClassroomEssential,
} from "../../../../api/courseApi";

export default function AllClassroomEssentials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // load list
  const fetchList = () => {
    setLoading(true);
    getAllClassroomEssentials()
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load classroom essentials."))
      .finally(() => setLoading(false));
  };

  useEffect(fetchList, []);

  // call delete API then refresh
  const handleDelete = (ID) => {
    if (!window.confirm("Delete this essential?")) return;
    deleteClassroomEssential(ID)
      .then(() => fetchList())
      .catch(() => alert("Delete failed"));
  };

  if (loading) return <div className="p-4 text-gray-600">Loading essentials…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Classroom Essentials</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Active?</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr
                key={e.ID}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
              >
                <td className="border border-gray-300 px-4 py-2">{e.ID}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {e.classroom_essentials_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {e.classroom_essentials_description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {e.is_activate ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() =>
                      navigate(`/admin/courses/essentials/edit/${e.ID}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(e.ID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
