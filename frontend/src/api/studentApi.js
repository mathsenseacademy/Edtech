// src/api/studentApi.js
import api from "./api";

// Fetch detailed student info by ID
export const getStudentDetailsById = async (studentId) => {
  const response = await api.post("/student/student_detail_by_id/", {
    student_id: studentId,
  });
  return response.data;
};

// src/api/studentApi.js
export const updateMonthWiseBatchFeeStatus = async (payload) => {
  const response = await api.post("/batchmanegment/month_wise_batch_fee_status/", payload);
  return response.data;
};
