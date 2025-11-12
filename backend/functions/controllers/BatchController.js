import { BatchModel } from "../models/BatchModel.js";
import { db } from "../firebase/firebaseAdmin.js";
import { StudentModel } from "../models/StudentModel.js";

export const BatchController = {
  /** ✅ Get all batches */
  async getAll(req, res) {
    try {
      const batches = await BatchModel.getAll();
      res.json(batches);
    } catch (err) {
      console.error("🔥 getAll batches:", err);
      res.status(500).json({ message: "Error fetching batches" });
    }
  },

  /** ✅ Get students of a batch */
  async getStudentsByBatch(req, res) {
    try {
      const { id: batchId } = req.params;
      const batch = await BatchModel.getById(batchId);
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      const studentUids = batch.students || [];
      if (studentUids.length === 0) return res.json([]);

      const studentDocs = await Promise.all(
        studentUids.map((uid) => db.collection("students").doc(uid).get())
      );

      const students = studentDocs
        .filter((doc) => doc.exists)
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      res.json(students);
    } catch (err) {
      console.error("🔥 getStudentsByBatch error:", err);
      res.status(500).json({ message: "Error fetching batch students" });
    }
  },

  /** ✅ Get batch by ID */
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

  /** ✅ Get all batches by class */
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

  /** ✅ Create batch (supports 2 day/time slots) */
  async create(req, res) {
    try {
      const { name, description, classNumber, day, time, day2, time2 } = req.body;

      if (!name || classNumber === undefined)
        return res.status(400).json({ message: "name and classNumber required" });

      if (!day || !time)
        return res.status(400).json({ message: "At least one day and time required" });

      if ((day2 && !time2) || (!day2 && time2))
        return res.status(400).json({
          message: "If you provide second day, you must also provide second time (and vice versa)",
        });

      const newBatch = await BatchModel.create({
        name,
        description: description || "",
        classNumber,
        day,
        time,
        day2: day2 || null,
        time2: time2 || null,
      });

      res.status(201).json(newBatch);
    } catch (err) {
      console.error("🔥 create batch:", err);
      res.status(500).json({ message: "Error creating batch" });
    }
  },

  /** ✅ Update batch info */
  async update(req, res) {
    try {
      const batchId = req.params.id;
      const { name, description, day, time, day2, time2 } = req.body;

      const batch = await BatchModel.getById(batchId);
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      if ((day2 && !time2) || (!day2 && time2))
        return res.status(400).json({
          message: "If updating second day, include its time as well (and vice versa)",
        });

      const updated = await BatchModel.update(batchId, {
        name: name ?? batch.name,
        description: description ?? batch.description,
        day: day ?? batch.day,
        time: time ?? batch.time,
        day2: day2 ?? batch.day2,
        time2: time2 ?? batch.time2,
      });

      res.json(updated);
    } catch (err) {
      console.error("🔥 update batch:", err);
      res.status(500).json({ message: "Error updating batch" });
    }
  },

  /** ✅ Delete batch (and unassign students) */
  async delete(req, res) {
    try {
      const batchId = req.params.id;
      const batch = await BatchModel.getById(batchId);
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      const studentUids = batch.students || [];

      // Unassign batch from all students
      await Promise.all(
        studentUids.map(async (uid) => {
          const studentRef = db.collection("students").doc(uid);
          await db.runTransaction(async (t) => {
            const sDoc = await t.get(studentRef);
            if (!sDoc.exists) return;
            const updatedBatches = (sDoc.data().batches || []).filter((b) => b !== batchId);
            t.update(studentRef, {
              batches: updatedBatches,
              updated_at: new Date().toISOString(),
            });
          });
        })
      );

      await BatchModel.delete(batchId);
      res.json({ message: "Batch deleted successfully" });
    } catch (err) {
      console.error("🔥 delete batch:", err);
      res.status(500).json({ message: "Error deleting batch" });
    }
  },

  /** ✅ Assign a student to batch */
  async assignStudent(req, res) {
    try {
      const batchId = req.params.id;
      const { studentUid } = req.body;
      if (!studentUid)
        return res.status(400).json({ message: "studentUid required" });

      // Update in both collections
      await BatchModel.updateStudents(batchId, studentUid, "add");

      const studentRef = db.collection("students").doc(studentUid);
      await db.runTransaction(async (t) => {
        const snap = await t.get(studentRef);
        if (!snap.exists) throw new Error("Student not found");
        const current = new Set(snap.data().batches || []);
        current.add(batchId);
        t.update(studentRef, { batches: [...current], updated_at: new Date().toISOString() });
      });

      const updatedBatch = await BatchModel.getById(batchId);
      res.json({ message: "Student assigned successfully", batch: updatedBatch });
    } catch (err) {
      console.error("🔥 assignStudent error:", err);
      res.status(500).json({ message: err.message || "Error assigning student" });
    }
  },

  /** ✅ Unassign a student from batch */
  async unassignStudent(req, res) {
    try {
      const batchId = req.params.id;
      const { studentUid } = req.body;
      if (!studentUid)
        return res.status(400).json({ message: "studentUid required" });

      await BatchModel.updateStudents(batchId, studentUid, "remove");

      const studentRef = db.collection("students").doc(studentUid);
      await db.runTransaction(async (t) => {
        const snap = await t.get(studentRef);
        if (!snap.exists) throw new Error("Student not found");
        const updated = (snap.data().batches || []).filter((b) => b !== batchId);
        t.update(studentRef, { batches: updated, updated_at: new Date().toISOString() });
      });

      const updatedBatch = await BatchModel.getById(batchId);
      res.json({ message: "Student unassigned successfully", batch: updatedBatch });
    } catch (err) {
      console.error("🔥 unassignStudent error:", err);
      res.status(500).json({ message: err.message || "Error unassigning student" });
    }
  },

  /** ✅ Unassign all students from batch */
  async unassignBatch(req, res) {
    try {
      const batchId = req.params.id;
      const batch = await BatchModel.getById(batchId);
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      const studentUids = batch.students || [];
      await Promise.all(
        studentUids.map(async (uid) => {
          const studentRef = db.collection("students").doc(uid);
          await db.runTransaction(async (t) => {
            const sDoc = await t.get(studentRef);
            if (!sDoc.exists) return;
            const updated = (sDoc.data().batches || []).filter((b) => b !== batchId);
            t.update(studentRef, { batches: updated, updated_at: new Date().toISOString() });
          });
        })
      );

      await BatchModel.clearStudents(batchId);
      res.json({ message: "Batch unassigned from all students successfully" });
    } catch (err) {
      console.error("🔥 unassignBatch error:", err);
      res.status(500).json({ message: err.message || "Error unassigning batch" });
    }
  },
};
