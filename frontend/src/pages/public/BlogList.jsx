// src/pages/BlogList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Plus, Search } from "lucide-react";
import api from "../../api/api";
import { getUserRole } from "../../auth";

const BlogListPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, published, draft
  const role = getUserRole();

  useEffect(() => {
    loadBlogs();
  }, [filter]);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      let params = "";
      if (role === "admin") {
        params = filter !== "all" ? `?status=${filter}` : "";
      } else {
        params = "?status=published";
      }
      const response = await api.get(`/api/blogs${params}`);

      setBlogs(response.data);
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
    setLoading(false);
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content) => {
    if (!content || !content.blocks) return "5 min";
    const wordCount = content.blocks.reduce((acc, block) => {
      const text = block.data?.text || "";
      return acc + text.split(" ").length;
    }, 0);
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-gray-600">
            Explore our latest articles and insights
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {role === "admin" && (
              <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Blogs</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
            )}

            {role === "admin" && (
              <button
                onClick={() => navigate("/admin/blog/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <Plus size={20} />
                New Blog
              </button>
            )}
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map(
                (blog) => (
                  console.log(blog),
                  console.log(blog.slug),
                  (
                    <div
                      key={blog.id}
                      onClick={() => navigate(`/blogs/${blog.id}`)}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer transition hover:shadow-md"
                    >
                      {blog.blog_image && (
                        <img
                          src={blog.blog_image}
                          alt={blog.title}
                          className="w-full h-48 object-cover"
                        />
                      )}

                      <div className="p-6">
                        {blog.status === "draft" && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                            Draft
                          </span>
                        )}

                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                          {blog.title}
                        </h3>

                        {blog.meta_description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {blog.meta_description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{formatDate(blog.created_at)}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>
                              {blog.read_time || getReadingTime(blog.content)}
                            </span>
                          </div>
                        </div>

                        {blog.category && (
                          <div className="mt-3">
                            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* Empty State */}
            {filteredBlogs.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                No blogs found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
