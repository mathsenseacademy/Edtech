// src/components/AdminPanel/SetPaper/GetQuestionById.jsx
import { useState } from "react";
import { getQuestionById } from "../../../api/questionApi";

const GetQuestionById = () => {
  const [id, setId] = useState("");
  const [q, setQ] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQ = async () => {
    try {
      setLoading(true);
      const { data } = await getQuestionById(Number(id));
      setQ(data);
    } catch {
      alert("Question not found");
      setQ(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sp-form">
      <h2>Fetch Question by ID</h2>

      <label>
        Question ID
        <input value={id} onChange={(e) => setId(e.target.value)} />
      </label>

      <button className="btn-primary" onClick={fetchQ} disabled={!id || loading}>
        {loading ? "Loading…" : "Load"}
      </button>

      {q && (
        <pre style={{ marginTop: "1.5rem", whiteSpace: "pre-wrap" }}>
{JSON.stringify(q, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default GetQuestionById;
