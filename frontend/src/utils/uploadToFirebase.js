// src/utils/uploadToFirebase.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

/**
 * Upload a file to Firebase Storage.
 *
 * @param {File} file - The file object from input.
 * @param {string} folder - Top level folder (e.g. "blog-images", "blog-files", "students").
 * @param {string} [blogId] - Optional subfolder, usually the blog id.
 * @returns {Promise<{url: string, name: string, size: number, path: string}>}
 */
export async function uploadToFirebase(file, folder = "students", blogId) {
  try {
    const timestamp = Date.now();
    const safeName = file.name || `file_${timestamp}`;
    const path = blogId
      ? `${folder}/${blogId}/${timestamp}_${safeName}`
      : `${folder}/${timestamp}_${safeName}`;

    const fileRef = ref(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      name: safeName,
      size: file.size,
      path, // this is used later for deleteFromFirebase
    };
  } catch (error) {
    console.error("Firebase upload error:", error);
    throw error;
  }
}

/**
 * Delete a file from Firebase Storage by its storage path.
 *
 * @param {string} path - The storage path (e.g. "blog-images/blogId/1234_file.png").
 */
export async function deleteFromFirebase(path) {
  try {
    if (!path) return;
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Firebase delete error:", error);
    // Don't throw here so your editor doesn't completely break on delete failure
  }
}
