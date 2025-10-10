// src/components/AdminPanel/AdminPanel.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import StudentList from "./StudentList";
import StudentEdit from "./StudentEdit";
import CoursesPanel from "./Courses/CoursesPanel";
import SetPaper from "./setQuestion/SetPaper";
import BatchPanel from './Batches/BatchPanel';


const AdminPanel = () => (
  <Routes>
    {/* default landing → students */}
    <Route path="students" element={<StudentList />} />
  <Route path="students/edit/:id" element={<StudentEdit />} />

    <Route path="courses/*" element={<CoursesPanel />} />
    {/* set-paper with its own nested routes */}
    <Route path="set-paper/*" element={<SetPaper />} />

    {/* any unknown path inside /admin → redirect to student list */}
    <Route path="" element={<Navigate to="students" replace />} />
    <Route path="/batches/*" element={<BatchPanel />} />
  </Routes>
);

export default AdminPanel;
