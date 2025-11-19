// BACKEND: Firestore BlogModel.js
// =========================================================

import { db } from "../firebase/firebaseAdmin.js";

const blogsCollection = db.collection("blogs");

// ----------------------------------------------
// Helper: Create a URL-friendly slug from text
// ----------------------------------------------
function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ----------------------------------------------
// Helper: Ensure slug uniqueness
// ----------------------------------------------
async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || "blog";
  let suffix = "";

  while (true) {
    const testSlug = suffix ? `${candidate}-${suffix}` : candidate;

    const snapshot = await blogsCollection
      .where("slug", "==", testSlug)
      .get();

    const docs = snapshot.docs.filter(d =>
      excludeId ? d.id !== excludeId : true
    );

    if (docs.length === 0) return testSlug;

    // Append timestamp-based collision suffix
    suffix = Date.now().toString(36);
  }
}

export const BlogModel = {
  // =========================================================
  // CREATE
  // =========================================================
  async create(blogData) {
    try {
      const docRef = blogsCollection.doc();

      const titleSource =
        blogData.title || blogData.heading || blogData.slug || "blog";

      const baseSlug = slugify(titleSource);
      const uniqueSlug = await ensureUniqueSlug(baseSlug);

      const newBlog = {
        ...blogData,
        slug: uniqueSlug,
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

  // =========================================================
  // GET ALL
  // =========================================================
  async getAll() {
    try {
      const snapshot = await blogsCollection
        .orderBy("created_at", "desc")
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("🔥 Error getting all blogs:", error);
      throw error;
    }
  },

  // =========================================================
  // GET BY ID
  // =========================================================
  async getById(id) {
    try {
      const snap = await blogsCollection.doc(id).get();
      return snap.exists ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
      console.error("🔥 Error getting blog by ID:", error);
      throw error;
    }
  },

  // =========================================================
  // UPDATE
  // =========================================================
  async update(id, updateData) {
    try {
      const docRef = blogsCollection.doc(id);
      const existingSnap = await docRef.get();

      if (!existingSnap.exists) {
        throw new Error(`Blog with id ${id} not found`);
      }

      const existing = existingSnap.data();
      const dataToUpdate = {
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      // Only regenerate slug if title changes
      if (updateData.title && updateData.title !== existing.title) {
        const baseSlug = slugify(updateData.title);
        dataToUpdate.slug = await ensureUniqueSlug(baseSlug, id);
      }

      // Do NOT accidentally wipe blog_image if not included
      if (!("blog_image" in updateData)) {
        delete dataToUpdate.blog_image;
      }

      await docRef.update(dataToUpdate);
      const updatedDoc = await docRef.get();

      return { id, ...updatedDoc.data() };
    } catch (error) {
      console.error("🔥 Error updating blog:", error);
      throw error;
    }
  },

  // =========================================================
  // DELETE
  // =========================================================
  async delete(id) {
    try {
      await blogsCollection.doc(id).delete();
      return true;
    } catch (error) {
      console.error("🔥 Error deleting blog:", error);
      throw error;
    }
  },

  // =========================================================
  // QUERY (FIND MANY)
  // =========================================================
  async findMany(criteria = {}) {
    try {
      let query = blogsCollection;

      Object.keys(criteria).forEach(field => {
        if (criteria[field] !== undefined && criteria[field] !== null) {
          query = query.where(field, "==", criteria[field]);
        }
      });

      const snapshot = await query.get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("🔥 Error in findMany:", error);
      throw error;
    }
  },

  // =========================================================
  // EXISTS
  // =========================================================
  async exists(criteria) {
    const result = await this.findMany(criteria);
    return result.length > 0;
  },
};
