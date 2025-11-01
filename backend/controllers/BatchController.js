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
      res.status(500).json({ message: "Error fetching batches" });
    }
  },

  async getStudentsByBatch(req, res) {
  try {
    const { id: batchId } = req.params;

    const batchDoc = await db.collection("batches").doc(batchId).get();
    if (!batchDoc.exists) return res.status(404).json({ message: "Batch not found" });

    const batchData = batchDoc.data();
    const studentUids = batchData.students || [];

    if (studentUids.length === 0) return res.json([]); // no students assigned

    // Fetch all student documents
    const studentDocs = await Promise.all(
      studentUids.map((uid) => db.collection("students").doc(uid).get())
    );

    const students = studentDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    res.json(students);
  } catch (err) {
    console.error("🔥 getStudentsByBatch error:", err);
    res.status(500).json({ message: "Error fetching batch students" });
  }
},

  async getById(req, res) {
    try {
      const batch = await BatchModel.getById(req.params.id);
      if (!batch) return res.status(404).json({ message: "Batch not found" });
      res.json(batch);
    } catch (err) {
      console.error("🔥 getById batch:", err);
      res.status(500).json({ message: "Error fetching batch" });
    }
  },

  async getByClass(req, res) {
    try {
      const { classNumber } = req.params;
      const batches = await BatchModel.getByClass(classNumber);
      res.json(batches);
    } catch (err) {
      console.error("🔥 getByClass:", err);
      res.status(500).json({ message: "Error fetching class batches" });
    }
  },

  async create(req, res) {
    try {
      const { name, description, classNumber } = req.body;
      if (!name || classNumber === undefined)
        return res.status(400).json({ message: "name and classNumber required" });

      const newBatch = await BatchModel.create({ name, description, classNumber });
      res.status(201).json(newBatch);
    } catch (err) {
      console.error("🔥 create batch:", err);
      res.status(500).json({ message: "Error creating batch" });
    }
  },

  async update(req, res) {
    try {
      const updated = await BatchModel.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      console.error("🔥 update batch:", err);
      res.status(500).json({ message: "Error updating batch" });
    }
  },

  async delete(req, res) {
    try {
      const batchId = req.params.id;
      const batch = await BatchModel.getById(batchId);
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      // Remove batch reference from all students
      const studentUids = batch.students || [];
      for (const uid of studentUids) {
        const studentRef = db.collection("students").doc(uid);
        await db.runTransaction(async (t) => {
          const sDoc = await t.get(studentRef);
          if (!sDoc.exists) return;
          const data = sDoc.data();
          const updatedBatches = (data.batches || []).filter((b) => b !== batchId);
          t.update(studentRef, {
            batches: updatedBatches,
            updated_at: new Date().toISOString(),
          });
        });
      }

      await BatchModel.delete(batchId);
      res.json({ message: "Batch deleted successfully" });
    } catch (err) {
      console.error("🔥 delete batch:", err);
      res.status(500).json({ message: "Error deleting batch" });
    }
  },

  async assignStudent(req, res) {
    try {
      const batchId = req.params.id;
      const { studentUid } = req.body;
      if (!studentUid)
        return res.status(400).json({ message: "studentUid required" });

      const batchRef = db.collection("batches").doc(batchId);
      const studentRef = db.collection("students").doc(studentUid);

      await db.runTransaction(async (t) => {
        const [batchSnap, studentSnap] = await Promise.all([
          t.get(batchRef),
          t.get(studentRef),
        ]);

        if (!batchSnap.exists) throw new Error("Batch not found");
        if (!studentSnap.exists) throw new Error("Student not found");

        const batchStudents = new Set(batchSnap.data().students || []);
        const studentBatches = new Set(studentSnap.data().batches || []);

        batchStudents.add(studentUid);
        studentBatches.add(batchId);

        t.update(batchRef, { students: [...batchStudents], updated_at: new Date().toISOString() });
        t.update(studentRef, { batches: [...studentBatches], updated_at: new Date().toISOString() });
      });

      const updatedBatch = await BatchModel.getById(batchId);
      res.json({ message: "Student assigned successfully", batch: updatedBatch });
    } catch (err) {
      console.error("🔥 assignStudent error:", err);
      res.status(500).json({ message: err.message || "Error assigning student" });
    }
  },

  async unassignStudent(req, res) {
    try {
      const batchId = req.params.id;
      const { studentUid } = req.body;
      if (!studentUid)
        return res.status(400).json({ message: "studentUid required" });

      const batchRef = db.collection("batches").doc(batchId);
      const studentRef = db.collection("students").doc(studentUid);

      await db.runTransaction(async (t) => {
        const [batchSnap, studentSnap] = await Promise.all([
          t.get(batchRef),
          t.get(studentRef),
        ]);

        if (!batchSnap.exists) throw new Error("Batch not found");
        if (!studentSnap.exists) throw new Error("Student not found");

        const updatedBatchStudents = (batchSnap.data().students || []).filter((u) => u !== studentUid);
        const updatedStudentBatches = (studentSnap.data().batches || []).filter((b) => b !== batchId);

        t.update(batchRef, { students: updatedBatchStudents, updated_at: new Date().toISOString() });
        t.update(studentRef, { batches: updatedStudentBatches, updated_at: new Date().toISOString() });
      });

      const updatedBatch = await BatchModel.getById(batchId);
      res.json({ message: "Student unassigned successfully", batch: updatedBatch });
    } catch (err) {
      console.error("🔥 unassignStudent error:", err);
      res.status(500).json({ message: err.message || "Error unassigning student" });
    }
  },
};
