import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Edit,
  ArrowLeft,
  MessageCircle,
  Send,
} from "lucide-react";
import api from "../api/api";
import { getCurrentUser, getUserRole } from "../auth";

const BlogPostPage = () => {
  // const { slug } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const role = getUserRole();

  // useEffect(() => {
  //   if (!slug) return; // prevent crash
  //   loadBlog();
  //   loadComments();
  // }, [slug]);
  useEffect(() => {
    if (!id) return; // prevent crash
    loadBlog();
    loadComments();
  }, [id]);

  const loadBlog = async () => {
    setLoading(true);
    try {
      // const response = await api.get(`/api/blogs/slug/${slug}`);
      const response = await api.get(`/api/blogs/${id}`);
      setBlog(response.data);
      console.log("Loaded blog:", response.data);
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
            1: "text-4xl font-bold mt-8 mb-4",
            2: "text-3xl font-bold mt-6 mb-3",
            3: "text-2xl font-bold mt-5 mb-2",
            4: "text-xl font-semibold mt-4 mb-2",
            5: "text-lg font-semibold mt-3 mb-2",
            6: "text-base font-semibold mt-2 mb-1",
          };
          return (
            <HeadingTag
              key={index}
              className={`${headerStyles[block.data.level]} text-gray-900`}
            >
              {block.data.text}
            </HeadingTag>
          );
        }

        case "paragraph":
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
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
              className={`${listClass} list-inside text-gray-700 mb-4 space-y-2`}
            >
              {block.data.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          );
        }

        case "image":
          return (
            <div key={index} className="my-6">
              <img
                src={block.data.file.url}
                alt={block.data.caption || ""}
                className="w-full rounded-lg shadow-sm"
              />
              {block.data.caption && (
                <p className="text-center text-sm text-gray-600 mt-2 italic">
                  {block.data.caption}
                </p>
              )}
            </div>
          );

        // case 'attaches':
        // if (block.data.file.extension === "pdf") {
        //   return (
        //     <div
        //       key={index}
        //       className="my-6 border rounded-lg overflow-hidden shadow-sm"
        //     >
        //       <div className="bg-gray-100 px-4 py-2 border-b">
        //         <p className="text-sm font-medium text-gray-700">
        //           {block.data.title || "PDF Document"}
        //         </p>
        //       </div>
        //       <iframe
        //         src={`${block.data.file.url}#toolbar=0&navpanes=0&scrollbar=0`}
        //         className="w-full h-96"
        //         title={block.data.title}
        //       />
        //     </div>
        //   );
        // }
        // return null;

        case 'attaches':
  if (block.data.file.extension === 'pdf') {
    // Encode the PDF URL
    const encodedUrl = encodeURIComponent(block.data.file.url);
    const viewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
    
    return (
      <div 
        key={index} 
        className="pdf-container my-6 border rounded-lg overflow-hidden shadow-sm"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="bg-gray-100 px-4 py-2 border-b">
          <p className="text-sm font-medium text-gray-700">
            📄 {block.data.title || 'PDF Document'}
          </p>
        </div>
        
        <div className="relative" style={{ height: '600px' }}>
          <iframe
            src={viewerUrl}
            className="w-full h-full"
            title={block.data.title}
            style={{ border: 'none' }}
          />
        </div>
        
        <div className="bg-blue-50 px-4 py-2 border-t text-xs text-gray-600">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Blog not found
          </h1>
          <button
            onClick={() => navigate("/blogs")}
            className="text-blue-600 hover:underline"
          >
            Back to blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/blogs")}
          className="text-blue-600 hover:underline flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </button>

        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>
            </div>
             {role === "admin" && (
            <button
              onClick={() => navigate(`/blogs/edit/${blog.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit size={16} />
              Edit
            </button>)}
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 pb-6 border-b">
            {/* <div className="flex items-center gap-2">
              <User size={16} />
              <span>{blog.author || "Anonymous"}</span>
            </div> */}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{blog.content.time} min read</span>
            </div> */}
          </div>

          {blog.blog_image && (
            <img
              src={blog.blog_image}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="prose prose-lg max-w-none">
            {renderContent(blog.content)}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle size={24} />
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
            />
            <button
              type="submit"
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Send size={16} />
              Post Comment
            </button>
          </form>

          {comments.length === 0 && (
            <p className="text-center text-gray-600 py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
