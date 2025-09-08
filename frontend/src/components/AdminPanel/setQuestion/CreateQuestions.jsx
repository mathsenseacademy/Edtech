// src/components/AdminPanel/SetPaper/CreateQuestions.jsx
import { useState } from "react";
import { createQuestionNew } from "../../../api/questionApi";
import Loader from "../../Loader/DataLoader";

const empty = {
  Question: "",
  OptionA: "",
  OptionB: "",
  OptionC: "",
  OptionD: "",
  RightOption: "",
  Marks: 1,
  Remarks: ""
};

const CreateQuestions = () => {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    // quick validation
    if (!form.Question.trim()) return alert("Question is required");
    if (!form.OptionA || !form.OptionB) return alert("At least Option A & B are required");
    if (!["A", "B", "C", "D"].includes(form.RightOption))
      return alert("Right Option must be A, B, C, or D");
    if (form.Marks <= 0) return alert("Marks must be greater than 0");

    try {
      setSaving(true);
      await createQuestionNew(form); // POST to /exam/questions/
      alert("Question created!");
      setForm(empty);
    } catch (err) {
      console.error(err);
      alert("Could not create question.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="sp-form" onSubmit={submit}>
      <h2>Create Question</h2>

      <label>
        Question
        <textarea
          name="Question"
          value={form.Question}
          onChange={update}
          required
        />
      </label>

      <label>
        Option A
        <input
          type="text"
          name="OptionA"
          value={form.OptionA}
          onChange={update}
          required
        />
      </label>

      <label>
        Option B
        <input
          type="text"
          name="OptionB"
          value={form.OptionB}
          onChange={update}
          required
        />
      </label>

      <label>
        Option C
        <input
          type="text"
          name="OptionC"
          value={form.OptionC}
          onChange={update}
        />
      </label>

      <label>
        Option D
        <input
          type="text"
          name="OptionD"
          value={form.OptionD}
          onChange={update}
        />
      </label>

      <label>
        Right Option (A/B/C/D)
        <input
          type="text"
          name="RightOption"
          value={form.RightOption}
          onChange={(e) =>
            setForm({ ...form, RightOption: e.target.value.toUpperCase() })
          }
          maxLength={1}
          required
        />
      </label>

      <label>
        Marks
        <input
          type="number"
          name="Marks"
          value={form.Marks}
          onChange={update}
          min={1}
          required
        />
      </label>

      <label>
        Remarks
        <textarea
          name="Remarks"
          value={form.Remarks}
          onChange={update}
        />
      </label>

      <button className="btn-primary" disabled={saving}>
        {saving ? <Loader size={20} /> : "Save"}
      </button>
    </form>
  );
};

export default CreateQuestions;
