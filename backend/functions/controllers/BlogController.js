import { BlogModel } from "../models/BlogModel.js";
import admin from "firebase-admin";

const db = admin.firestore();
const bucket = admin.storage().bucket();

export const BlogController = {
  // Create blog
  async create(req, res) {
    try {
      const {
        title,
        content,
        blog_image,
        files,
        author_id,
        status,
        meta_description,
        category,
      } = req.body;

      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content are required" });
      }

      // Generate slug
      const generateSlug = (title) =>
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");

      const slug = generateSlug(title);

      const blogData = {
        title,
        slug,
        content,
        blog_image: blog_image || "",
        files: files || [],
        author_id: author_id || null,
        status: status || "draft",
        meta_description: meta_description || "",
        category: category || "",
        created_at: new Date(),
      };

      const blog = await BlogModel.create(blogData);
      return res.status(201).json(blog);
    } catch (error) {
      console.error("🔥 Error creating blog:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ✅ FIXED: Get all blogs (Using BlogModel instead of direct db access)
  async getAll(req, res) {
    try {
      const { status } = req.query;
      let blogs;

      // If filtering by status (draft/published)
      if (status && (status === "draft" || status === "published")) {
        // Use the findMany method inside BlogModel
        blogs = await BlogModel.findMany({ status });
      } else {
        // Use the getAll method inside BlogModel
        blogs = await BlogModel.getAll();
      }

      res.json(blogs);
    } catch (err) {
      console.error("🔥 Error fetching blogs:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // Get single blog by ID
  async getById(req, res) {
    console.log("Getting blog by ID:", req.params.id);
    try {
      const { id } = req.params;
      const blog = await BlogModel.getById(id);

      if (!blog) return res.status(404).json({ error: "Blog not found" });

      return res.status(200).json(blog);
    } catch (error) {
      console.error("🔥 Error getting blog:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ✅ FIXED: Get a blog by slug (Using BlogModel)
  async getBySlug(req, res) {
    console.log("Getting blog by slug:", req.params.slug);
    try {
      const { slug } = req.params;

      // Use findMany because slugs are stored as fields
      const results = await BlogModel.findMany({ slug });

      if (results.length === 0) {
        return res.status(404).json({ error: "Blog not found" });
      }

      res.json(results[0]);
    } catch (err) {
      console.error("🔥 Error fetching blog by slug:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // Update a blog
  async update(req, res) {
    try {
      const { id } = req.params;

      const {
        title,
        content,
        blog_image,
        files,
        status,
        meta_description,
        category,
      } = req.body;

      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (blog_image !== undefined) updateData.blog_image = blog_image;
      if (files !== undefined) updateData.files = files;
      if (status !== undefined) updateData.status = status;
      if (meta_description !== undefined)
        updateData.meta_description = meta_description;
      if (category !== undefined) updateData.category = category;

      // Auto-update slug if title changes
      if (title) {
        updateData.slug = title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }

      const updated = await BlogModel.update(id, updateData);
      return res.status(200).json(updated);
    } catch (error) {
      console.error("🔥 Error updating blog:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete blog
  async remove(req, res) {
    try {
      const blogId = req.params.id;

      const blogRef = db.collection("blogs").doc(blogId);
      const blogSnap = await blogRef.get();

      if (!blogSnap.exists) {
        return res.status(404).json({ error: "Blog not found" });
      }

      const blog = blogSnap.data();

      // -------------------------------------------
      // Collect all storage paths to delete
      // -------------------------------------------
      const pathsToDelete = [];

      // 1. Blog cover image
      // if (blog.blog_image) {
      //   const match = decodeURIComponent(blog.blog_image).match(/o\/(.+?)\?/);
      //   if (match && match[1]) pathsToDelete.push(match[1]);
      // }
      const url = decodeURIComponent(blog.blog_image);
      const start = url.indexOf("/o/") + 3;
      const end = url.indexOf("?");

      if (start > 2 && end > start) {
        const extractedPath = url.substring(start, end);
        pathsToDelete.push(extractedPath);
      }

      // 2. EditorJS block files
      if (blog.content?.blocks) {
        blog.content.blocks.forEach((block) => {
          if (block.data?.file?.path) {
            pathsToDelete.push(block.data.file.path);
          }
        });
      }

      // Remove duplicates
      const uniquePaths = [...new Set(pathsToDelete)];

      // -------------------------------------------
      // Delete files from Firebase Storage
      // -------------------------------------------
      await Promise.all(
        uniquePaths.map(async (path) => {
          try {
            await bucket.file(path).delete();
            console.log("Deleted:", path);
          } catch (err) {
            console.log("Skip missing file:", path);
          }
        })
      );

      // -------------------------------------------
      // Delete the Firestore document
      // -------------------------------------------
      await blogRef.delete();

      return res.json({
        success: true,
        deletedFiles: uniquePaths,
        message: "Blog and its media deleted successfully.",
      });
    } catch (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
  },
};
