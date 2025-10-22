// backend/models/BatchModel.js
import { db } from "../firebase/firebaseAdmin.js";

const batchesCollection = db.collection("batches");

export const BatchModel = {
  async create(data) {
    const docRef = batchesCollection.doc();
    const payload = {
      name: data.name?.trim() || "",
      description: data.description?.trim() || "",
      classNumber: data.classNumber ?? null,
      students: Array.isArray(data.students) ? data.students : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await docRef.set(payload);
    const snap = await docRef.get();
    return { id: snap.id, ...snap.data() };
  },

  async getAll() {
    const snapshot = await batchesCollection.orderBy("classNumber", "asc").get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getById(id) {
    const snap = await batchesCollection.doc(id).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  },

  async getByClass(classNumber) {
    const snapshot = await batchesCollection.where("classNumber", "==", Number(classNumber)).get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async update(id, data) {
    const ref = batchesCollection.doc(id);
    await ref.update({ ...data, updated_at: new Date().toISOString() });
    const snap = await ref.get();
    return { id: snap.id, ...snap.data() };
  },

  async delete(id) {
    await batchesCollection.doc(id).delete();
    return true;
  },
};
