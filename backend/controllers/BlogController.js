import { BlogModel } from "../models/BlogModel.js";

export const BlogController = {
  // ✅ Create blog
  async create(req, res) {
    try {
      const { title, content, blog_image } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      // Accept Base64 string directly
      const blog = await BlogModel.create({
        title,
        content,
        blog_image: blog_image || "", // store Base64 directly
      });

      res.status(201).json(blog);
    } catch (error) {
      console.error("🔥 Error creating blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ✅ Get all blogs
  async getAll(req, res) {
    try {
      const blogs = await BlogModel.getAll();
      res.status(200).json(blogs);
    } catch (error) {
      console.error("🔥 Error getting blogs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ✅ Get single blog
  async getById(req, res) {
    try {
      const { id } = req.params;
      const blog = await BlogModel.getById(id);
      if (!blog) return res.status(404).json({ error: "Blog not found" });
      res.status(200).json(blog);
    } catch (error) {
      console.error("🔥 Error getting blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ✅ Update blog
  async update(req, res) {
    try {
      const { id } = req.params;

      // Only update provided fields
      const { title, content, blog_image } = req.body;
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (blog_image) updateData.blog_image = blog_image;

      const updated = await BlogModel.update(id, updateData);
      res.status(200).json(updated);
    } catch (error) {
      console.error("🔥 Error updating blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ✅ Delete blog
  async remove(req, res) {
    try {
      const { id } = req.params;
      const success = await BlogModel.delete(id);
      if (success) res.status(200).json({ message: "Blog deleted" });
      else res.status(404).json({ error: "Blog not found" });
    } catch (error) {
      console.error("🔥 Error deleting blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
