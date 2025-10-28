import { db } from "../firebase/firebaseAdmin.js";

const classesCollection = db.collection("classes");

export const ClassModel = {
  /** ✅ Create new class */
  async create(classData) {
    try {
      const docRef = classesCollection.doc(); // Auto ID

      const payload = {
        classRange: classData.classRange || "",
        title: classData.title || "",
        description: classData.description || "",
        purpose:
          typeof classData.purpose === "string"
            ? classData.purpose.trim()
            : "",

        // 🔥 Automatic string → array conversion
        topics:
          typeof classData.topics === "string"
            ? classData.topics
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : Array.isArray(classData.topics)
            ? classData.topics
            : [],

        suggestedBooks:
          typeof classData.suggestedBooks === "string"
            ? classData.suggestedBooks
                .split(",")
                .map((b) => b.trim())
                .filter(Boolean)
            : Array.isArray(classData.suggestedBooks)
            ? classData.suggestedBooks
            : [],

        courseType:
          typeof classData.courseType === "boolean"
            ? classData.courseType
            : false, // false = short

        active:
          typeof classData.active === "boolean" ? classData.active : true,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await docRef.set(payload);
      const createdDoc = await docRef.get();
      return { id: createdDoc.id, ...createdDoc.data() };
    } catch (error) {
      console.error("🔥 Error creating class:", error);
      throw error;
    }
  },

  /** ✅ Get all classes */
  async getAll() {
    try {
      const snapshot = await classesCollection.orderBy("classRange").get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("🔥 Error getting all classes:", error);
      throw error;
    }
  },

  /** ✅ Get single class by Firestore ID */
  async getById(id) {
    try {
      const docSnap = await classesCollection.doc(id).get();
      return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("🔥 Error getting class by ID:", error);
      throw error;
    }
  },

  /** ✅ Update class by ID */
  async update(id, updateData) {
    try {
      const payload = {
        classRange:
          typeof updateData.classRange === "string"
            ? updateData.classRange
            : "",
        title: updateData.title || "",
        description: updateData.description || "",
        purpose:
          typeof updateData.purpose === "string"
            ? updateData.purpose.trim()
            : "",

        // 🔥 Automatic string → array conversion
        topics:
          typeof updateData.topics === "string"
            ? updateData.topics
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : Array.isArray(updateData.topics)
            ? updateData.topics
            : [],

        suggestedBooks:
          typeof updateData.suggestedBooks === "string"
            ? updateData.suggestedBooks
                .split(",")
                .map((b) => b.trim())
                .filter(Boolean)
            : Array.isArray(updateData.suggestedBooks)
            ? updateData.suggestedBooks
            : [],

        courseType:
          typeof updateData.courseType === "boolean"
            ? updateData.courseType
            : false,

        active:
          typeof updateData.active === "boolean"
            ? updateData.active
            : true,

        updated_at: new Date().toISOString(),
      };

      await classesCollection.doc(id).set(payload, { merge: true });
      const updatedDoc = await classesCollection.doc(id).get();
      return { id, ...updatedDoc.data() };
    } catch (error) {
      console.error("🔥 Error updating class:", error);
      throw error;
    }
  },

  /** ✅ Delete class by ID */
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
