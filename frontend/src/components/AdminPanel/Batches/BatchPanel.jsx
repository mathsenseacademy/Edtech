// src/components/AdminPanel/BatchPanel.jsx
import { useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { FaList, FaPlus, FaEdit, FaMoneyBill } from "react-icons/fa";
import { motion } from "framer-motion";

import AllBatches      from "./AllBatches";
import CreateBatch     from "./CreateBatch";
// import EditBatch       from "./EditBatch";
import AddBatchFee     from "./AddBatchFee";
import FeeStatus       from "./FeeStatus";


export default function BatchPanel() {
  const [open, setOpen] = useState(false);
  const base = "/admin/batches";

  const tabs = [
    { to: `${base}/all`,        icon: <FaList />,      label: "All Batches" },
    { to: `${base}/create`,     icon: <FaPlus />,      label: "Create Batch" },
    { to: `${base}/edit/:id`,   icon: <FaEdit />,      label: "Edit Batch" },
    { to: `${base}/fee/:id`,    icon: <FaMoneyBill />, label: "Add Fee" },
    { to: `${base}/status/:id`, icon: <FaMoneyBill />, label: "Fee Status" },
  ];

  return (
    <section className="bp-wrapper">
      <button className="bp-toggle btn btn-outline-primary" onClick={() => setOpen(!open)}>
        {open ? "✕ Close" : "☰ Batches Menu"}
      </button>

      <motion.nav
        initial={false}
        animate={open ? { x: 0 } : { x: -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bp-nav bg-light border-end"
      >
        {tabs.map(({ to, icon, label }) => (
          <NavLink key={to} to={to.replace(":id", "")} className={({ isActive }) => `bp-link ${isActive ? "active" : ""}`}>
            <span className="me-2">{icon}</span>
            <span className="link-label">{label}</span>
          </NavLink>
        ))}
      </motion.nav>

      <motion.div
        className="bp-content"
        initial={false}
        animate={open ? { marginLeft: 100 } : { marginLeft: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setOpen(false)}
      >
        <Routes>
          <Route index element={<Navigate to="all" replace />} />
          <Route path="all"        element={<AllBatches />} />
          <Route path="create"     element={<CreateBatch />} />
          <Route path="edit/:id"   element={<CreateBatch />} />
          <Route path="fee/:id"    element={<AddBatchFee />} />
          <Route path="status/:id" element={<FeeStatus />} />
          <Route path="*"          element={<Navigate to="all" replace />} />
        </Routes>
      </motion.div>
    </section>
  );
}
