// backend/models/ClassModel.js
import { db } from "../firebase/firebaseAdmin.js";

const classesCollection = db.collection("classes");

export const ClassModel = {
  async create(classData) {
    try {
      const docRef = classesCollection.doc(); // Auto ID
      await docRef.set({
        ...classData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      const createdDoc = await docRef.get();
      return { id: createdDoc.id, ...createdDoc.data() };
    } catch (error) {
      console.error("🔥 Error creating class:", error);
      throw error;
    }
  },

  async getAll() {
    try {
      const snapshot = await classesCollection.orderBy("classNumber").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("🔥 Error getting all classes:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const docSnap = await classesCollection.doc(id).get();
      return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("🔥 Error getting class by ID:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      await classesCollection.doc(id).update({
        ...updateData,
        updated_at: new Date().toISOString(),
      });
      const updatedDoc = await classesCollection.doc(id).get();
      return { id, ...updatedDoc.data() };
    } catch (error) {
      console.error("🔥 Error updating class:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await classesCollection.doc(id).delete();
      return true;
    } catch (error) {
      console.error("🔥 Error deleting class:", error);
      throw error;
    }
  },
};
