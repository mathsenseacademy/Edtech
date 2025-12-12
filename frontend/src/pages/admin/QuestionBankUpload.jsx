import React, { useState } from "react";
import * as XLSX from "xlsx";
import AdminHeader from "../../components/layout/AdminHeader";
import { getAuth } from "firebase/auth";

// Replace with your actual deployed URL if needed
const FUNCTIONS_BASE = "https://api-bqojuh5xfq-uc.a.run.app"; 
const UPLOAD_FN = `${FUNCTIONS_BASE}/api/admin/question-bank/upload`;

const AdminQuestionBankUpload = () => {
  const [classId, setClassId] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewRows, setPreviewRows] = useState(null);

  const classes = [...Array(12).keys()].map((n) => n + 1);

  // Helper: Parse file to JSON rows (Client-side)
  const parseExcelToRows = async (fileBlob) => {
    const arrayBuffer = await fileBlob.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // defval: "" ensures empty cells are treated as empty strings rather than undefined
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  };

  const handleFileChange = async (e) => {
    setSuccessMsg("");
    setErrorMsg("");
    setPreviewRows(null);
    setRowCount(0);
    const f = e.target.files[0] || null;
    setFile(f);
    if (!f) return;

    const allowed = [".xlsx", ".xls"];
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      setErrorMsg("Please select an Excel file (.xlsx or .xls).");
      setFile(null);
      return;
    }

    try {
      // PREVIEW LOGIC: Parse strictly for UI feedback
      const rows = await parseExcelToRows(f);
      setRowCount(rows.length);
      // Show first 5 rows in console for debugging if needed
      console.log("Preview rows:", rows.slice(0, 5));
    } catch (err) {
      console.error("Excel parse error:", err);
      setErrorMsg("Failed to parse Excel for preview. (File might still be valid)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!classId || !topic || !file) {
      setErrorMsg("Please select class, enter topic and choose an Excel file.");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be signed in to upload.");
      }
      const idToken = await user.getIdToken();

      // 1. PARSE THE FILE IN THE BROWSER
      // We parse the full file here to send pure data to the server
      const rows = await parseExcelToRows(file);

      if (!rows || rows.length === 0) {
        throw new Error("The Excel file appears to be empty.");
      }

      // 2. CREATE JSON PAYLOAD
      // We send the data array directly, avoiding multipart/form-data issues
      const payload = {
        classId: classId,
        topic: topic.trim(),
        rows: rows, 
      };

      // 3. SEND AS JSON
      const res = await fetch(UPLOAD_FN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Important: We are sending JSON now
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccessMsg(
        `Success! Uploaded ${data.count} questions for Class ${data.classId}.`
      );

      // Reset form
      setClassId("");
      setTopic("");
      setFile(null);
      setRowCount(0);
      setPreviewRows(null);
      e.target.reset?.(); // Reset file input UI
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="pt-24 px-4">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Upload Question Bank (Excel)</h2>
          
          {errorMsg && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{errorMsg}</div>}
          {successMsg && <div className="mb-3 text-sm text-green-600 bg-green-50 p-2 rounded">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class *</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Topic *</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Trigonometry"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Excel File *</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="w-full"
              />
              {/* Preview UI */}
              {rowCount > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  Detected <strong>{rowCount}</strong> rows ready for upload.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Question Bank"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminQuestionBankUpload;