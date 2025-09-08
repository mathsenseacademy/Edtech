// src/components/AdminPanel/SetPaper/EditQuestions.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionById, editQuestion } from "../../../api/questionApi";
import Loader from "../../Loader/DataLoader";

const EditQuestions = () => {
  const { qid }      = useParams();         // ← ID from URL
  const [q, setQ]    = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  /* --- load on mount -------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getQuestionById(Number(qid));
        const row = Array.isArray(data) ? data : data.results?.[0] || data;
        setQ({
          id:          Number(qid),
          question:    row[0],
          optioncount: row[1],
          marks:       row[2],
          isactive:    row[3],
        });
      } catch {
        alert("Question not found");
        navigate("../all");
      }
    })();
  }, [qid, navigate]);

  /* --- update & save -------------------------------------------- */
  const update = (e) => setQ({ ...q, [e.target.name]: e.target.value });

const save = async (e) => {
  e.preventDefault();

  // PAYLOAD – exactly what the backend accepts
  const payload = {
    question:    q.question.trim(),
    optioncount: Number(q.optioncount),
    marks:       Number(q.marks),
    isactive:    Number(q.isactive),
  };

  // quick guard
  if (!payload.question)        return alert("Question text required");
  if (payload.optioncount < 2)  return alert("At least 2 options");
  if (payload.marks <= 0)       return alert("Marks must be > 0");

  try {
    setSaving(true);
    await editQuestion(payload);           
    alert("Updated!");
    navigate("/admin/set-paper/all");     
  } catch {
    alert("Could not update question");
  } finally {
    setSaving(false);
  }
};


  if (!q) return <Loader size={56} />;

  return (
    <form className="sp-form" onSubmit={save}>
      <h2>Edit ID {q.id}</h2>
      <label>
        Question
        <textarea name="question" value={q.question} onChange={update} required />
      </label>
      <label>
        Option Count
        <input type="number" name="optioncount" value={q.optioncount} onChange={update} />
      </label>
      <label>
        Marks
        <input type="number" name="marks" value={q.marks} onChange={update} />
      </label>
      <label>
        Active?
        <select name="isactive" value={q.isactive} onChange={update}>
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </label>
      <button className="btn-primary" disabled={saving}>
        {saving ? <Loader size={20} /> : "Save"}
      </button>
    </form>
  );
};

export default EditQuestions;
