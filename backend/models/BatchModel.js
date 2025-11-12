import { db } from "../firebase/firebaseAdmin.js";

const batchesCollection = db.collection("batches");

export const BatchModel = {
  /** ✅ Create a new batch (supports day & time, plus optional day2/time2) */
  async create(data) {
    const docRef = batchesCollection.doc();

    const payload = {
      name: data.name?.trim() || "",
      description: data.description?.trim() || "",
      classNumber: Number(data.classNumber) ?? null,
      day: data.day || "",
      time: data.time || "",
      day2: data.day2 || "",
      time2: data.time2 || "",
      students: Array.isArray(data.students) ? data.students : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await docRef.set(payload);
    const snap = await docRef.get();
    return { id: snap.id, ...snap.data() };
  },

  /** ✅ Fetch all batches (sorted by class number) */
  async getAll() {
    const snapshot = await batchesCollection.orderBy("classNumber", "asc").get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** ✅ Fetch single batch by ID */
  async getById(id) {
    const snap = await batchesCollection.doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },

  /** ✅ Fetch all batches of a specific class */
  async getByClass(classNumber) {
    const snapshot = await batchesCollection
      .where("classNumber", "==", Number(classNumber))
      .get();

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** ✅ Update batch details (supports second day/time) */
  async update(id, data) {
    const ref = batchesCollection.doc(id);

    const updatePayload = {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.classNumber !== undefined && { classNumber: Number(data.classNumber) }),
      ...(data.day !== undefined && { day: data.day }),
      ...(data.time !== undefined && { time: data.time }),
      ...(data.day2 !== undefined && { day2: data.day2 }),
      ...(data.time2 !== undefined && { time2: data.time2 }),
      ...(data.students !== undefined && { students: data.students }),
      updated_at: new Date().toISOString(),
    };

    await ref.update(updatePayload);
    const snap = await ref.get();
    return { id: snap.id, ...snap.data() };
  },

  /** ✅ Delete a batch */
  async delete(id) {
    await batchesCollection.doc(id).delete();
    return true;
  },

  /** ✅ Clear all students from batch */
  async clearStudents(id) {
    const ref = batchesCollection.doc(id);
    await ref.update({
      students: [],
      updated_at: new Date().toISOString(),
    });

    const snap = await ref.get();
    return { id: snap.id, ...snap.data() };
  },

  /** ✅ Add or remove a single student UID from a batch */
  async updateStudents(batchId, studentUid, action = "add") {
    const ref = batchesCollection.doc(batchId);

    await db.runTransaction(async (t) => {
      const docSnap = await t.get(ref);
      if (!docSnap.exists) throw new Error("Batch not found");

      const existing = new Set(docSnap.data().students || []);
      if (action === "add") existing.add(studentUid);
      if (action === "remove") existing.delete(studentUid);

      t.update(ref, {
        students: [...existing],
        updated_at: new Date().toISOString(),
      });
    });

    const updatedSnap = await ref.get();
    return { id: updatedSnap.id, ...updatedSnap.data() };
  },
};
