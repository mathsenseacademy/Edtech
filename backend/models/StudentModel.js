// BACKEND: Firestore StudentModel.js (Clean Firestore Style)
// =========================================================

import { db } from "../firebase/firebaseAdmin.js";

const studentsCollection = db.collection("students");

export const StudentModel = {
  // Create new student (uid as doc ID)
  async create(studentData) {
    try {
      const docRef = studentsCollection.doc(studentData.uid);
      await docRef.set(studentData);
      const createdDoc = await docRef.get();
      return { id: createdDoc.id, ...createdDoc.data() };
    } catch (error) {
      console.error("🔥 Error creating student:", error);
      throw error;
    }
  },

  // Get all students ordered by registration date
  async getAll() {
    try {
      const snapshot = await studentsCollection
        .orderBy("registered_at", "desc")
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("🔥 Error getting all students:", error);
      throw error;
    }
  },

  // Get verified students
  async getVerified() {
    try {
      const snapshot = await studentsCollection
        .where("is_verified", "==", true)
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("🔥 Error getting verified students:", error);
      throw error;
    }
  },

  // Get student by ID (doc ID = uid)
  async getById(id) {
    try {
      const docSnap = await studentsCollection.doc(id).get();
      return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("🔥 Error getting student by ID:", error);
      throw error;
    }
  },

  // Update student
  async update(id, updateData) {
    try {
      await studentsCollection.doc(id).update(updateData);
      const updatedDoc = await studentsCollection.doc(id).get();
      return { id, ...updatedDoc.data() };
    } catch (error) {
      console.error("🔥 Error updating student:", error);
      throw error;
    }
  },

  // Firestore-style "findOne" (no Mongo-style $or)
  async findOne(criteria) {
    try {
      console.log("🔍 Firestore findOne with criteria:", criteria);

      if (criteria.uid) {
        const docSnap = await studentsCollection.doc(criteria.uid).get();
        return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
      }

      let query = studentsCollection;
      Object.keys(criteria).forEach(field => {
        if (criteria[field] !== undefined && criteria[field] !== null) {
          query = query.where(field, "==", criteria[field]);
        }
      });

      const snapshot = await query.limit(1).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error("🔥 Error in findOne:", error);
      throw error;
    }
  },

  // Find many students by criteria
  async findMany(criteria) {
    try {
      let query = studentsCollection;
      Object.keys(criteria).forEach(field => {
        if (criteria[field] !== undefined && criteria[field] !== null) {
          query = query.where(field, "==", criteria[field]);
        }
      });

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("🔥 Error in findMany:", error);
      throw error;
    }
  },

  // Soft delete
  async delete(id) {
    try {
      await studentsCollection.doc(id).update({
        active: false,
        deleted_at: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("🔥 Error deleting student:", error);
      throw error;
    }
  },

  // Exists check
  async exists(criteria) {
    try {
      const student = await this.findOne(criteria);
      return !!student;
    } catch (error) {
      console.error("🔥 Error in exists:", error);
      throw error;
    }
  },

  // Get by class
  async getByClass(studentClass) {
    try {
      const snapshot = await studentsCollection
        .where("student_class", "==", studentClass)
        .orderBy("registered_at", "desc")
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("🔥 Error getting by class:", error);
      throw error;
    }
  },

  // Stats
  async getStats() {
    try {
      const allSnapshot = await studentsCollection.get();
      const verifiedSnapshot = await studentsCollection
        .where("is_verified", "==", true)
        .get();

      const total = allSnapshot.size;
      const verified = verifiedSnapshot.size;
      const unverified = total - verified;

      const classCounts = {};
      allSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const studentClass = data.student_class;
        classCounts[studentClass] = (classCounts[studentClass] || 0) + 1;
      });

      return { total, verified, unverified, classCounts };
    } catch (error) {
      console.error("🔥 Error getting stats:", error);
      throw error;
    }
  }
};
