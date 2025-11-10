// backend/controllers/ClassController.js
import { ClassModel } from "../models/ClassModel.js";

export const ClassController = {
  async getAll(req, res) {
    try {
      const classes = await ClassModel.getAll();
      res.json(classes);
    } catch (error) {
      console.error("🔥 Error in getAll classes:", error);
      res.status(500).json({ message: "Error fetching classes" });
    }
  },

  async getById(req, res) {
    try {
      const cls = await ClassModel.getById(req.params.id);
      if (!cls) return res.status(404).json({ message: "Class not found" });
      res.json(cls);
    } catch (error) {
      console.error("🔥 Error in getById:", error);
      res.status(500).json({ message: "Error fetching class" });
    }
  },

  async create(req, res) {
    try {
      const newClass = await ClassModel.create(req.body);
      res.status(201).json(newClass);
    } catch (error) {
      console.error("🔥 Error creating class:", error);
      res.status(500).json({ message: "Error creating class" });
    }
  },

  async update(req, res) {
    try {
      const updatedClass = await ClassModel.update(req.params.id, req.body);
      res.json(updatedClass);
    } catch (error) {
      console.error("🔥 Error updating class:", error);
      res.status(500).json({ message: "Error updating class" });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await ClassModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Class not found" });
      res.json({ message: "Class deleted successfully" });
    } catch (error) {
      console.error("🔥 Error deleting class:", error);
      res.status(500).json({ message: "Error deleting class" });
    }
  },
};
