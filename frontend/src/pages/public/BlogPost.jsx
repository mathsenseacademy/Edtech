import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Edit,
  ArrowLeft,
  Trash2,
  MessageCircle,
  Send,
} from "lucide-react";
import api from "../../api/api";
import { getCurrentUser, getUserRole } from "../../auth";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const role = getUserRole();

  useEffect(() => {
    if (!id) return;
    loadBlog();
    loadComments();
  }, [id]);

  const loadBlog = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error loading blog:", error);
    }
    setLoading(false);
  };

  const loadComments = () => {
    setComments([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = async (blogId) => {
      try {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this blog?"
        );
        if (!confirmDelete) return;

        await api.delete(`/api/blogs/${blogId}`);

        alert("Blog deleted successfully!");
        navigate("/blogs"); // Reload list page
      } catch (err) {
        console.error("DELETE ERROR:", err);
        alert("Failed to delete blog");
      }
    };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      created_at: new Date().toISOString(),
      replies: [],
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const renderContent = (content) => {
    if (!content || !content.blocks) return null;

    return content.blocks.map((block, index) => {
      switch (block.type) {
        case "header": {
          const HeadingTag = `h${block.data.level}`;
          const headerStyles = {
            1: "text-4xl font-bold mt-10 mb-5 text-slate-900",
            2: "text-3xl font-bold mt-8 mb-4 text-slate-900",
            3: "text-2xl font-bold mt-6 mb-3 text-slate-900",
            4: "text-xl font-semibold mt-5 mb-3 text-slate-800",
            5: "text-lg font-semibold mt-4 mb-2 text-slate-800",
            6: "text-base font-semibold mt-3 mb-2 text-slate-800",
          };
          return (
            <HeadingTag key={index} className={headerStyles[block.data.level]}>
              {block.data.text}
            </HeadingTag>
          );
        }

        case "paragraph":
          return (
            <p
              key={index}
              className="text-slate-700 text-lg leading-relaxed mb-5"
            >
              {block.data.text}
            </p>
          );

        case "list": {
          const ListTag = block.data.style === "ordered" ? "ol" : "ul";
          const listClass =
            block.data.style === "ordered" ? "list-decimal" : "list-disc";

          return (
            <ListTag
              key={index}
              className={`${listClass} list-inside text-slate-700 text-lg mb-5 space-y-2 ml-4`}
            >
              {block.data.items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ListTag>
          );
        }

        case "image":
          return (
            <div key={index} className="my-8">
              <img
                src={block.data.file.url}
                alt={block.data.caption || ""}
                className="w-full rounded-xl shadow-md"
              />
              {block.data.caption && (
                <p className="text-center text-sm text-slate-600 mt-3 italic">
                  {block.data.caption}
                </p>
              )}
            </div>
          );

        case "attaches":
          if (block.data.file.extension === "pdf") {
            const encodedUrl = encodeURIComponent(block.data.file.url);
            const viewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;

            return (
              <div
                key={index}
                className="pdf-container my-8 border-2 border-slate-200 rounded-xl overflow-hidden shadow-md"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-700">
                    📄 {block.data.title || "PDF Document"}
                  </p>
                </div>

                <div className="relative" style={{ height: "600px" }}>
                  <iframe
                    src={viewerUrl}
                    className="w-full h-full"
                    title={block.data.title}
                    style={{ border: "none" }}
                  />
                </div>

                <div className="bg-slate-50 px-5 py-2 border-t text-xs text-slate-600">
                  ℹ️ Viewing via Google Docs Viewer
                </div>
              </div>
            );
          }
          return null;

        default:
          return null;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-900"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Blog not found
          </h1>
          <button
            onClick={() => navigate("/blogs")}
            className="text-slate-900 hover:underline"
          >
            Back to blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
        <div
          className="inline-flex items-center gap-2 text-slate-600 mb-8 font-medium cursor-pointer"
          onClick={() => navigate("/blogs")}
        >
          <ArrowLeft size={18} className="text-slate-400" />
          <span>Blog Post</span>
        </div>

        {/* MAIN CARD */}
        <article className="bg-gradient-to-br from-[#fefefe] via-[#f4f5f7] to-[#c0d0ed] rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden mb-8">
          {blog.blog_image && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden">
              <img
                src={blog.blog_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          <div className="px-6 sm:px-8 md:px-12 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                {blog.title}
              </h1>

              {role === "admin" && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <button
                    onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                    className="self-start bg-blue-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md font-medium text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="self-start bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md font-medium text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={18} className="text-slate-400" />
                <span className="font-medium">
                  {formatDate(blog.created_at)}
                </span>
              </div>
            </div>

            <div className="prose prose-slate prose-lg max-w-none">
              {renderContent(blog.content)}
            </div>

            {blog.tags?.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* COMMENTS */}
        {/* <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="px-6 sm:px-8 md:px-12 py-8 sm:py-10">
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle size={28} className="text-slate-700" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Comments{" "}
                <span className="ml-2 text-slate-500 font-normal text-xl">
                  ({comments.length})
                </span>
              </h2>
            </div>

            <form onSubmit={handleCommentSubmit} className="mb-10">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-slate-400 focus:outline-none resize-none text-slate-900 placeholder:text-slate-400"
                rows="4"
              />
              <button
                type="submit"
                className="mt-4 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Send size={18} />
                Post Comment
              </button>
            </form>

            {comments.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BlogPostPage;
