import { db } from "../firebase/firebaseAdmin.js";

const batchesCollection = db.collection("batches");

export const BatchModel = {
  // ✅ Create new batch (supports name, description, classNumber, day, time)
  async create(data) {
    const docRef = batchesCollection.doc();
    const payload = {
      name: data.name?.trim() || "",
      description: data.description?.trim() || "",
      classNumber: data.classNumber ?? null,
      day: data.day || "",
      time: data.time || "",
      students: Array.isArray(data.students) ? data.students : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await docRef.set(payload);
    const snap = await docRef.get();
    return { id: snap.id, ...snap.data() };
  },

  // ✅ Get all batches (sorted by class number)
  async getAll() {
    const snapshot = await batchesCollection.orderBy("classNumber", "asc").get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // ✅ Get a single batch by ID
  async getById(id) {
    const snap = await batchesCollection.doc(id).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  },

  // ✅ Get all batches of a specific class
  async getByClass(classNumber) {
    const snapshot = await batchesCollection
      .where("classNumber", "==", Number(classNumber))
      .get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // ✅ Update batch details (name, description, day, time, etc.)
  async update(id, data) {
    const ref = batchesCollection.doc(id);
    const updatePayload = {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.day !== undefined && { day: data.day }),
      ...(data.time !== undefined && { time: data.time }),
      updated_at: new Date().toISOString(),
    };

    await ref.update(updatePayload);
    const snap = await ref.get();
    return { id: snap.id, ...snap.data() };
  },

  // ✅ Delete batch
  async delete(id) {
    await batchesCollection.doc(id).delete();
    return true;
  },

  // ✅ Clear all students from a batch (used by unassignBatch)
  async clearStudents(id) {
    const ref = batchesCollection.doc(id);
    await ref.update({
      students: [],
      updated_at: new Date().toISOString(),
    });
    const snap = await ref.get();
    return { id: snap.id, ...snap.data() };
  },
};
