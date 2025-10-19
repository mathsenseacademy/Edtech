// backend/controllers/BatchController.js
import { BatchModel } from "../models/BatchModel.js";
import { db } from "../firebase/firebaseAdmin.js";
import { StudentModel } from "../models/StudentModel.js";

export const BatchController = {
  async getAll(req, res) {
    try {
      const batches = await BatchModel.getAll();
      return res.json(batches);
    } catch (err) {
      console.error("🔥 getAll batches:", err);
      return res.status(500).json({ message: "Error fetching batches" });
    }
  },

  async getById(req, res) {
    try {
      const batch = await BatchModel.getById(req.params.id);
      if (!batch) return res.status(404).json({ message: "Batch not found" });
      return res.json(batch);
    } catch (err) {
      console.error("🔥 getById:", err);
      return res.status(500).json({ message: "Error fetching batch" });
    }
  },

  async getByClass(req, res) {
    try {
      const { classNumber } = req.params;
      const batches = await BatchModel.getByClass(classNumber);
      return res.json(batches);
    } catch (err) {
      console.error("🔥 getByClass:", err);
      return res.status(500).json({ message: "Error fetching batches for class" });
    }
  },

  async create(req, res) {
    try {
      const { name, description, classNumber } = req.body;
      if (!name || classNumber === undefined || classNumber === null) {
        return res.status(400).json({ message: "name and classNumber required" });
      }
      const newBatch = await BatchModel.create({ name, description, classNumber });
      return res.status(201).json(newBatch);
    } catch (err) {
      console.error("🔥 create batch:", err);
      return res.status(500).json({ message: "Error creating batch" });
    }
  },

  async update(req, res) {
    try {
      const updated = await BatchModel.update(req.params.id, req.body);
      return res.json(updated);
    } catch (err) {
      console.error("🔥 update batch:", err);
      return res.status(500).json({ message: "Error updating batch" });
    }
  },

  async delete(req, res) {
    try {
      // When deleting a batch, also remove references from students
      const batchId = req.params.id;
      const batch = await BatchModel.getById(batchId);
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      // Remove batch id from all students who have it
      const studentUids = batch.students || [];
      const batchWriter = db.batch();
      for (const uid of studentUids) {
        const studentRef = db.collection("students").doc(uid);
        // Read then update: We'll read doc then write after read
        // Simpler approach: do a transaction for each student
        await db.runTransaction(async (t) => {
          const sDoc = await t.get(studentRef);
          if (!sDoc.exists) return;
          const data = sDoc.data();
          const batchesArr = Array.isArray(data.batches) ? data.batches.filter((b) => b !== batchId) : [];
          t.update(studentRef, { batches: batchesArr, updated_at: new Date().toISOString() });
        });
      }

      // Finally delete batch
      await BatchModel.delete(batchId);
      return res.json({ message: "Batch deleted and student references removed" });
    } catch (err) {
      console.error("🔥 delete batch:", err);
      return res.status(500).json({ message: "Error deleting batch" });
    }
  },

  // Assign a student to a batch (transactionally update batch.students and student.batches)
  async assignStudent(req, res) {
    try {
      const batchId = req.params.id;
      const { studentUid } = req.body;
      if (!studentUid) return res.status(400).json({ message: "studentUid required" });

      const batchRef = db.collection("batches").doc(batchId);
      const studentRef = db.collection("students").doc(studentUid);

      await db.runTransaction(async (t) => {
        const batchSnap = await t.get(batchRef);
        const studentSnap = await t.get(studentRef);

        if (!batchSnap.exists) throw new Error("Batch not found");
        if (!studentSnap.exists) throw new Error("Student not found");

        const batchData = batchSnap.data();
        const studentData = studentSnap.data();

        const batchStudents = Array.isArray(batchData.students) ? new Set(batchData.students) : new Set();
        const studentBatches = Array.isArray(studentData.batches) ? new Set(studentData.batches) : new Set();

        batchStudents.add(studentUid);
        studentBatches.add(batchId);

        t.update(batchRef, { students: Array.from(batchStudents), updated_at: new Date().toISOString() });
        t.update(studentRef, { batches: Array.from(studentBatches), updated_at: new Date().toISOString() });
      });

      const updatedBatch = await BatchModel.getById(batchId);
      const updatedStudent = await StudentModel.getById(studentUid);
      return res.json({ message: "Assigned", batch: updatedBatch, student: updatedStudent });
    } catch (err) {
      console.error("🔥 assignStudent error:", err);
      return res.status(500).json({ message: err.message || "Error assigning student to batch" });
    }
  },

  // Unassign: remove relationship both sides
  async unassignStudent(req, res) {
    try {
      const batchId = req.params.id;
      const { studentUid } = req.body;
      if (!studentUid) return res.status(400).json({ message: "studentUid required" });

      const batchRef = db.collection("batches").doc(batchId);
      const studentRef = db.collection("students").doc(studentUid);

      await db.runTransaction(async (t) => {
        const batchSnap = await t.get(batchRef);
        const studentSnap = await t.get(studentRef);

        if (!batchSnap.exists) throw new Error("Batch not found");
        if (!studentSnap.exists) throw new Error("Student not found");

        const batchData = batchSnap.data();
        const studentData = studentSnap.data();

        const batchStudents = Array.isArray(batchData.students) ? batchData.students.filter((u) => u !== studentUid) : [];
        const studentBatches = Array.isArray(studentData.batches) ? studentData.batches.filter((b) => b !== batchId) : [];

        t.update(batchRef, { students: batchStudents, updated_at: new Date().toISOString() });
        t.update(studentRef, { batches: studentBatches, updated_at: new Date().toISOString() });
      });

      const updatedBatch = await BatchModel.getById(batchId);
      const updatedStudent = await StudentModel.getById(studentUid);
      return res.json({ message: "Unassigned", batch: updatedBatch, student: updatedStudent });
    } catch (err) {
      console.error("🔥 unassignStudent error:", err);
      return res.status(500).json({ message: err.message || "Error unassigning student from batch" });
    }
  },
};
