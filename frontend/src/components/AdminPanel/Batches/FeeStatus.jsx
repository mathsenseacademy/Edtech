// src/components/AdminPanel/Batches/FeeStatus.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentFeeStatus } from "../../../api/batchApi";

export default function FeeStatus() {
  const { id } = useParams();
  const [status, setStatus] = useState([]);

  useEffect(() => {
    getStudentFeeStatus(id).then(res => setStatus(res.data));
  }, [id]);
  console.log(status);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-info-subtle">
            <h2>Student Fee Status for Batch</h2>
          </div>
          <div className="card-body">
            <div className="row">
              {
                status?.map((valOne, KeyOne) => {
                  return (
                    <div key={KeyOne} className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <div className="card">
                        <div className="card-header bg-success-subtle">
                          <span>{valOne.name}</span>
                        </div>
                        <div className="card-body">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Amount</th>
                                <th>Fee Title</th>
                                <th>Payment Date</th>
                                <th>Payment Status</th>
                                <th>Transaction Id</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                valOne?.fees?.map((valTwo, KeyTwo) => {
                                  return (
                                    <tr key={KeyTwo}>
                                      <td>{valTwo.amount}</td>
                                      <td>{valTwo.fee_title}</td>
                                      <td>{valTwo.payment_date}</td>
                                      <td>{valTwo.payment_status}</td>
                                      <td>{valTwo.transaction_id}</td>
                                    </tr>
                                  )
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
