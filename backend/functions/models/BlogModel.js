// BACKEND: Firestore BlogModel.js
// =========================================================

import { db } from "../firebase/firebaseAdmin.js";

const blogsCollection = db.collection("blogs");

export const BlogModel = {
  // ✅ Create new blog
  async create(blogData) {
    try {
      const docRef = blogsCollection.doc();
      const newBlog = {
        ...blogData,
        // Ensure blog_image exists as empty string if not provided
        blog_image: blogData.blog_image || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await docRef.set(newBlog);

      const createdDoc = await docRef.get();
      return { id: createdDoc.id, ...createdDoc.data() };
    } catch (error) {
      console.error("🔥 Error creating blog:", error);
      throw error;
    }
  },

  // ✅ Get all blogs (newest first)
  async getAll() {
    try {
      const snapshot = await blogsCollection.orderBy("created_at", "desc").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("🔥 Error getting all blogs:", error);
      throw error;
    }
  },

  // ✅ Get single blog by ID
  async getById(id) {
    try {
      const docSnap = await blogsCollection.doc(id).get();
      return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("🔥 Error getting blog by ID:", error);
      throw error;
    }
  },

  // ✅ Update blog
  async update(id, updateData) {
    try {
      const dataToUpdate = {
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      // Ensure we do not accidentally remove blog_image if not provided
      if (!("blog_image" in dataToUpdate)) {
        delete dataToUpdate.blog_image;
      }

      await blogsCollection.doc(id).update(dataToUpdate);
      const updatedDoc = await blogsCollection.doc(id).get();
      return { id, ...updatedDoc.data() };
    } catch (error) {
      console.error("🔥 Error updating blog:", error);
      throw error;
    }
  },

  // ✅ Delete blog (hard delete)
  async delete(id) {
    try {
      await blogsCollection.doc(id).delete();
      return true;
    } catch (error) {
      console.error("🔥 Error deleting blog:", error);
      throw error;
    }
  },

  // ✅ Find by criteria (Firestore-style query)
  async findMany(criteria = {}) {
    try {
      let query = blogsCollection;
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

  // ✅ Exists check
  async exists(criteria) {
    try {
      const result = await this.findMany(criteria);
      return result.length > 0;
    } catch (error) {
      console.error("🔥 Error in exists check:", error);
      throw error;
    }
  },
};
