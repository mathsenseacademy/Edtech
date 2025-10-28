// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("https://mathsenseacademy.onrender.com/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("❌ Blog list fetch error:", err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Latest Blogs</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {blogs.map((blog) => (
          <Link
            key={blog.id}               // ✅ use Firestore 'id'
            to={`/blogs/${blog.id}`}     // ✅ use Firestore 'id' for routing
            className="border rounded-lg overflow-hidden hover:shadow-md transition"
          >
            {blog.image_url && (        // ✅ match Firestore field
              <img
                src={blog.image_url}
                alt={blog.title}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
              <p
                className="text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
