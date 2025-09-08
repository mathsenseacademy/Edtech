// src/pages/UpdateBatchFeeStatus.jsx
import React, { useState } from "react";
import {updateMonthWiseBatchFeeStatus}  from "../../../api/studentApi";

export default function UpdateBatchFeeStatus() {
  const [formData, setFormData] = useState({
    student_id: "",
    batch_fee_id: "",
    payment_status: "paid",
    payment_date: "",
    transaction_id: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    try {
      const payload = {
        ...formData,
        payment_date: new Date(formData.payment_date).toISOString(), // ensure ISO format
      };
      const res = await updateMonthWiseBatchFeeStatus(payload);
      setResponseMessage("Status updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fee-status-form">
      <h2>Update Batch Fee Status</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Student ID:
          <input
            type="number"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Batch Fee ID:
          <input
            type="number"
            name="batch_fee_id"
            value={formData.batch_fee_id}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Payment Status:
          <select
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
            required
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </label>

        <label>
          Payment Date:
          <input
            type="datetime-local"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Transaction ID:
          <input
            type="text"
            name="transaction_id"
            value={formData.transaction_id}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Update Status"}
        </button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}
