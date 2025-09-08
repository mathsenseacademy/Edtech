// src/api/batchApi.js
import api from "./api"; // your axios instance

export const createBatch = (payload) =>
  api.post("batchmanegment/create_batch/", payload);

export const getAllCourse = () =>
  api.get("coursemanegment/showallcourse/");

export const getAllBatches = () =>
  api.get("batchmanegment/all_batches_with_schedule/");

export const getBatchById = (batchId) =>
  api.post("batchmanegment/batch_detail_by_id/", {
    batch_id: batchId
  });

export const updateBatch = (payload) =>
  api.post("batchmanegment/update_batch/", payload);

export const addBatchFee = ({
    batch_id,
    fee_title,
    amount,
    due_date,
    fee_type
  }) =>
  api.post("batchmanegment/add_batch_fee/", {
    batch_id,
    fee_title,
    amount,
    due_date,
    fee_type,
  });

export const updateBatchFee = ({
    batch_fee_id,
    fee_title,
    amount,
    due_date,
    fee_type
  }) =>
  api.put("batchmanegment/batch_fee_by_id/", {
    batch_fee_id,
    fee_title,
    amount,
    due_date,
    fee_type,
  });

export const getStudentFeeStatus = (batchId) =>
  api.post("batchmanegment/student_fee_status_by_batch/", {
    batch_id: batchId
  });