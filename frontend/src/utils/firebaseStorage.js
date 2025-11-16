import { storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Storage folder (e.g., 'blog-images', 'blog-files')
 * @param {string} blogId - Optional blog ID for organization
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadToFirebase(file, folder = 'blog-content', blogId = null) {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${randomString}_${sanitizedFileName}`;
    
    // Create storage path
    const storagePath = blogId 
      ? `blogs/${blogId}/${folder}/${fileName}`
      : `blogs/${folder}/${fileName}`;
    
    // Create storage reference
    const storageRef = ref(storage, storagePath);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: storagePath,
      name: file.name,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

/**
 * Delete file from Firebase Storage
 * @param {string} filePath - Storage path of the file
 */
export async function deleteFromFirebase(filePath) {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    console.error('Firebase delete error:', error);
    return false;
  }
}

/**
 * Replace an existing file with a new one
 * Deletes old file path if provided
 */
export async function replaceFile(newFile, folder, blogId, oldFilePath = null) {
  try {
    // Upload new file
    const uploaded = await uploadToFirebase(newFile, folder, blogId);

    // Delete old file if present
    if (oldFilePath) {
      await deleteFromFirebase(oldFilePath);
    }

    return uploaded;
  } catch (error) {
    console.error("File replace error:", error);
    throw error;
  }
}


/**
 * Upload multiple files
 * @param {FileList} files - Files to upload
 * @param {string} folder - Storage folder
 * @param {string} blogId - Blog ID
 * @param {Function} onProgress - Progress callback
 */
export async function uploadMultipleFiles(files, folder, blogId, onProgress) {
  const uploads = Array.from(files).map(async (file, index) => {
    try {
      const result = await uploadToFirebase(file, folder, blogId);
      if (onProgress) {
        onProgress(index + 1, files.length);
      }
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message, fileName: file.name };
    }
  });
  
  return Promise.all(uploads);
}

/**
 * Generate slug from title
 * @param {string} title - Blog title
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '_')      // Replace spaces with underscore
    .replace(/_+/g, '_')       // Replace multiple underscores with single
    .replace(/^_|_$/g, '');    // Remove leading/trailing underscores
}

/**
 * Extract all file URLs from Editor.js content
 * Useful for cleanup when deleting a blog
 */
export function extractFileUrlsFromContent(content) {
  if (!content || !content.blocks) return [];
  
  const urls = [];
  
  content.blocks.forEach(block => {
    if (block.type === 'image' && block.data?.file?.url) {
      urls.push(block.data.file.url);
    }
    if (block.type === 'attaches' && block.data?.file?.url) {
      urls.push(block.data.file.url);
    }
  });
  
  return urls;
}

/**
 * Clean up orphaned files when blog is deleted
 */
export async function cleanupBlogFiles(blogId) {
  try {
    // Delete entire blog folder
    const folderRef = ref(storage, `blogs/${blogId}`);
    // Note: Firebase doesn't have a direct folder delete
    // You'll need to list and delete files individually or use Cloud Functions
    return true;
  } catch (error) {
    console.error('Cleanup error:', error);
    return false;
  }
}