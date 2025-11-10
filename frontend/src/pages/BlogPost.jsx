import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://api-bqojuh5xfq-uc.a.run.app/api/blogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Blog not found: ${res.status}`);
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch((err) => console.error("❌ Blog fetch error:", err));
  }, [id]);

  if (!blog)
    return <div className="text-center py-20 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      {blog.blog_image && (  // ✅ use blog_image instead of image_url
        <img
          src={blog.blog_image}
          alt={blog.title}
          className="w-full h-96 object-cover rounded mb-6"
        />
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogPost;
