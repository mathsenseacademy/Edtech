// backend/models/BatchModel.js
import { db } from "../firebase/firebaseAdmin.js";

const batchesCollection = db.collection("batches");

export const BatchModel = {
  // create batch (auto doc id)
  async create(data) {
    try {
      const docRef = batchesCollection.doc();
      const payload = {
        name: data.name || "",
        description: data.description || "",
        classNumber: data.classNumber ?? null, // number or string
        students: Array.isArray(data.students) ? data.students : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await docRef.set(payload);
      const snap = await docRef.get();
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error("🔥 BatchModel.create error:", err);
      throw err;
    }
  },

  async getAll() {
    try {
      const snapshot = await batchesCollection.orderBy("classNumber").get();
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error("🔥 BatchModel.getAll error:", err);
      throw err;
    }
  },

  async getById(id) {
    try {
      const snap = await batchesCollection.doc(id).get();
      return snap.exists ? { id: snap.id, ...snap.data() } : null;
    } catch (err) {
      console.error("🔥 BatchModel.getById error:", err);
      throw err;
    }
  },

  // get all batches for a classNumber
  async getByClass(classNumber) {
    try {
      const snapshot = await batchesCollection.where("classNumber", "==", Number(classNumber)).get();
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error("🔥 BatchModel.getByClass error:", err);
      throw err;
    }
  },

  async update(id, updateData) {
    try {
      await batchesCollection.doc(id).update({
        ...updateData,
        updated_at: new Date().toISOString(),
      });
      const snap = await batchesCollection.doc(id).get();
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error("🔥 BatchModel.update error:", err);
      throw err;
    }
  },

  async delete(id) {
    try {
      await batchesCollection.doc(id).delete();
      return true;
    } catch (err) {
      console.error("🔥 BatchModel.delete error:", err);
      throw err;
    }
  },

  // internal helper to replace students array entirely (not used externally)
  async setStudents(id, studentsArray) {
    try {
      await batchesCollection.doc(id).update({
        students: studentsArray,
        updated_at: new Date().toISOString(),
      });
      const snap = await batchesCollection.doc(id).get();
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error("🔥 BatchModel.setStudents error:", err);
      throw err;
    }
  },
};
