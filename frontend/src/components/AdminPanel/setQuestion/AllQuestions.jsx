// src/components/AdminPanel/SetPaper/AllQuestions.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuestions } from "../../../api/questionApi";
import Loader from "../../Loader/DataLoader";

const rowToObj = (row, idx) => ({
  id:          idx + 1,        // or your real ID
  question:    row[0],
  optioncount: row[1],
  marks:       row[2],
  isactive:    row[3],
});

const AllQuestions = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllQuestions()
      .then((res) => {
        const raw  = Array.isArray(res.data.questions) ? res.data.questions : res.data?.results || [];
        setItems(raw.map(rowToObj));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (id) => navigate(`../edit/${id}`);

  return (
    <div className="sp-table">
      <h2>All Questions</h2>

      {loading ? (
        <div className="text-center py-4">
          <Loader size={56} />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Marks</th>
              <th>Active?</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="4" className="text-center">No data</td></tr>
            ) : (
              items.map((q) => (
                <tr
                  key={q.id}
                  onClick={() => openEdit(q.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{q.id}</td>
                  <td>{q.question}</td>
                  <td>{q.marks}</td>
                  <td>{q.isactive ? "✅" : "❌"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllQuestions;
