// src/components/AdminPanel/Batches/AddBatchFee.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addBatchFee, updateBatchFee } from "../../../api/batchApi";
import api from "../../../api/api";

export default function AddBatchFee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formType, setFormType] = useState('Add');
  const [batchFee, setBatchFee] = useState();
  const [loadingBatchFee, setLoadingBatchFee] = useState(true);
  const [fee, setFee] = useState({ batch_fee_id: 0, fee_title: "", amount: "", due_date: "", fee_type: "recurring" });

  const handleChange = e => setFee({ ...fee, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (formType == 'Add') {
      addBatchFee({ batch_id: +id, ...fee }).then(() => navigate("/admin/batches/all"));
    } else {
      console.log('aa-',{...fee})
      updateBatchFee({ ...fee }).then(() => navigate("/admin/batches/all"));
    }
  };

  const handelEdit = (val) => {
    setFormType('Edit')
    setFee({
      batch_fee_id: val[0],
      fee_title: val[1],
      amount: val[2],
      due_date: val[3],
      fee_type: val[4],
    })
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(
          "batchmanegment/all_batch_fee/"
        );
        setBatchFee(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoadingBatchFee(false);
      }
    })();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <span>{formType} Fee to Batch</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-12 col-md-3 col-xl-2 col-lg-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">Fee Title</label>
                    <input type="text" className="form-control" name="fee_title" value={fee.fee_title} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-sm-12 col-md-3 col-xl-1 col-lg-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">Amount</label>
                    <input type="text" className="form-control" name="amount" value={fee.amount} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-sm-12 col-md-3 col-xl-2 col-lg-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">Due Date</label>
                    <input type="date" className="form-control" name="due_date" value={fee.due_date} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-sm-12 col-md-3 col-xl-1 col-lg-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">Fee Type</label>
                    <select name="fee_type" className="form-control" value={fee.fee_type} onChange={handleChange}>
                      <option value="one-time">One Time</option>
                      <option value="recurring">Recurring</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="text-end">
                <button type="submit" className="btn btn-success">{formType == 'Add' ? 'Save' : 'Update'} Fee</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="col-12">
        <table className="table">
          <thead>
            <tr>
              <th>Fee Title</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Fee Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              loadingBatchFee ? (
                <tr>
                  <td>Loading Fee...</td>
                </tr>
              ) : (
                batchFee.map((val, index) => {
                  return (
                    <tr key={index}>
                      <td>{val[1]}</td>
                      <td>{val[2]}</td>
                      <td>{val[3]}</td>
                      <td>{val[4]}</td>
                      <td>
                        <button className="btn btn-sm btn-warning" onClick={() => handelEdit(val)}>Edit</button>
                      </td>
                    </tr>
                  )
                })
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
