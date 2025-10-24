// src/pages/BlogEditor.jsx
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import api from "../api/api";

export default function BlogEditor() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    blog_image: "", // Base64 string
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Convert image file to Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Handle featured image upload
  const handleFeaturedImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, blog_image: base64 }));
      showToast("Featured image uploaded", "success");
    } catch (err) {
      console.error("Image upload failed:", err);
      showToast("Failed to upload image", "danger");
    }
  };

  // Handle Quill content change
  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit blog
  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      return showToast("Title and content are required", "danger");
    }

    setIsSubmitting(true);
    try {
      await api.post("http://localhost:5000/api/blogs", formData);
      showToast("Blog created successfully!", "success");
      setFormData({ title: "", content: "", blog_image: "" });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || "Failed to create blog", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create a New Blog</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Blog title"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Content</label>
        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={handleContentChange}
          placeholder="Write your blog here..."
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFeaturedImage}
          className="w-full p-2 border rounded"
        />
        {formData.blog_image && (
          <img
            src={formData.blog_image}
            alt="Blog Preview"
            className="mt-2 max-w-full h-auto border rounded"
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`px-4 py-2 rounded text-white ${
          isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-700 hover:bg-cyan-800"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Create Blog"}
      </button>

      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
