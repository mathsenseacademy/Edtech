import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Edit, ArrowLeft, MessageCircle, Send, Trash2, Reply } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadBlog();
    loadComments();
  }, [slug]);

  const loadBlog = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blogs/slug/${slug}`);
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error('Error loading blog:', error);
    }
    setLoading(false);
  };

  const loadComments = () => {
    // Load comments from your API/database
    // For now using mock data
    setComments([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      created_at: new Date().toISOString(),
      replies: []
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const renderContent = (content) => {
    if (!content || !content.blocks) return null;

    return content.blocks.map((block, index) => {
      switch (block.type) {
        case 'header':
          const HeadingTag = `h${block.data.level}`;
          const headerStyles = {
            1: 'text-4xl font-bold mt-8 mb-4',
            2: 'text-3xl font-bold mt-6 mb-3',
            3: 'text-2xl font-bold mt-5 mb-2',
            4: 'text-xl font-semibold mt-4 mb-2',
            5: 'text-lg font-semibold mt-3 mb-2',
            6: 'text-base font-semibold mt-2 mb-1'
          };
          return (
            <HeadingTag key={index} className={`${headerStyles[block.data.level]} text-gray-900`}>
              {block.data.text}
            </HeadingTag>
          );

        case 'paragraph':
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              {block.data.text}
            </p>
          );

        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const listClass = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc';
          return (
            <ListTag key={index} className={`${listClass} list-inside text-gray-700 mb-4 space-y-2`}>
              {block.data.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          );

        case 'image':
          return (
            <div key={index} className="my-6">
              <img
                src={block.data.file.url}
                alt={block.data.caption || ''}
                className="w-full rounded-lg shadow-sm"
              />
              {block.data.caption && (
                <p className="text-center text-sm text-gray-600 mt-2 italic">
                  {block.data.caption}
                </p>
              )}
            </div>
          );

        case 'attaches':
          if (block.data.file.extension === 'pdf') {
            return (
              <div key={index} className="my-6 border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-700">
                    {block.data.title || 'PDF Document'}
                  </p>
                </div>
                <iframe
                  src={`${block.data.file.url}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-96"
                  title={block.data.title}
                />
              </div>
            );
          }
          return null;

        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-blue-600 pl-4 my-6 italic text-gray-700">
              <p className="mb-2">{block.data.text}</p>
              {block.data.caption && (
                <cite className="text-sm text-gray-600 not-italic">— {block.data.caption}</cite>
              )}
            </blockquote>
          );

        case 'code':
          return (
            <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
              <code>{block.data.code}</code>
            </pre>
          );

        case 'delimiter':
          return (
            <div key={index} className="flex justify-center my-8">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              </div>
            </div>
          );

        case 'warning':
          return (
            <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded">
              {block.data.title && (
                <p className="font-semibold text-yellow-800 mb-2">{block.data.title}</p>
              )}
              <p className="text-yellow-700">{block.data.message}</p>
            </div>
          );

        case 'table':
          return (
            <div key={index} className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  {block.data.content.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        case 'checklist':
          return (
            <ul key={index} className="space-y-2 my-4">
              {block.data.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="rounded"
                  />
                  <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-700'}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          );

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <button
            onClick={() => navigate('/blogs')}
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
        {/* Back Button */}
        <button
          onClick={() => navigate('/blogs')}
          className="text-blue-600 hover:underline flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </button>

        {/* Blog Article */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>
            </div>
            <button
              onClick={() => navigate(`/blogs/edit/${blog.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit size={16} />
              Edit
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 pb-6 border-b">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{blog.author || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{blog.read_time} min read</span>
            </div>
          </div>

          {/* Cover Image */}
          {blog.blog_image && (
            <img
              src={blog.blog_image}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {renderContent(blog.content)}
          </div>

          {/* Tags */}
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

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle size={24} />
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
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

          {/* Comments List */}
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
