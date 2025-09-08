// src/components/AdminPanel/Batches/BatchForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createBatch,
  getAllCourse,
  getBatchById,
  updateBatch,
} from "../../../api/batchApi";

export default function BatchForm() {
  const { id } = useParams();               // will be undefined on “create”
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    batch_name: "",
    description: "",
    course_id: "",
    schedules: [
      { weekday: "", start_time: "", end_time: "" }
    ],
  });

  // If we're editing, fetch the existing batch
  useEffect(() => {
    if (isEdit) {
      getBatchById(id)
        .then(res => {
          // your API likely returns { batch_name, description, course_id, schedules }
          setForm({
            batch_name: res.data.batch_name,
            description: res.data.description,
            course_id: res.data.course_id,
            schedules: res.data.schedules
          });
        })
        .catch(console.error);
    }
  }, [id, isEdit]);

  const [allCourse, setAllCourse] = useState([]);

  useEffect(() => {
    getAllCourse()
      .then(res => setAllCourse(res.data))
      .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleScheduleChange = (idx, field, value) => {
    setForm(f => {
      const schedules = [...f.schedules];
      schedules[idx] = { ...schedules[idx], [field]: value };
      return { ...f, schedules };
    });
  };

  const addSchedule = () =>
    setForm(f => ({
      ...f,
      schedules: [...f.schedules, { weekday: "", start_time: "", end_time: "" }]
    }));

  const removeSchedule = idx =>
    setForm(f => ({
      ...f,
      schedules: f.schedules.filter((_, i) => i !== idx)
    }));

  const handleSubmit = e => {
    e.preventDefault();
    const payload = isEdit
      ? { batch_id: +id, ...form }
      : form;

    const action = isEdit
      ? updateBatch(payload)
      : createBatch(form);

    action
      .then(() => navigate("/admin/batches/all"))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-4">
      <h2>{isEdit ? "Edit Batch" : "Create New Batch"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Batch Name</label>
          <input
            name="batch_name"
            value={form.batch_name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Course ID</label>
          <select name="course_id" id="" className="form-control" onChange={handleChange} value={form.course_id}>
            {
              allCourse?.map((val, key) => {
                return (
                  <option key={key} value={val.ID}>{val.course_name}</option>
                )
              })
            }
          </select>
        </div>

        <hr />

        <h5>Schedules</h5>
        {form.schedules.map((s, i) => (
          <div key={i} className="row g-2 align-items-center mb-2">
            <div className="col">
              <select
                className="form-select"
                value={s.weekday}
                onChange={e => handleScheduleChange(i, "weekday", e.target.value)}
                required
              >
                <option value="">Weekday…</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                  .map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div className="col">
              <input
                type="time"
                className="form-control"
                value={s.start_time}
                onChange={e => handleScheduleChange(i, "start_time", e.target.value)}
                required
              />
            </div>
            <div className="col">
              <input
                type="time"
                className="form-control"
                value={s.end_time}
                onChange={e => handleScheduleChange(i, "end_time", e.target.value)}
                required
              />
            </div>
            <div className="col-auto">
              {form.schedules.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeSchedule(i)}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-link"
          onClick={addSchedule}
        >
          + Add another schedule
        </button>

        <hr />

        <button type="submit" className={`btn ${isEdit ? "btn-warning" : "btn-primary"}`}>
          {isEdit ? "Update Batch" : "Create Batch"}
        </button>
      </form>
    </div>
  );
}
