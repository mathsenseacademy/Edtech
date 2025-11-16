import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, X, Image } from 'lucide-react';
import EditorJsFirebase from '../components/EditorJsFirebase';
import { uploadToFirebase, generateSlug } from '../utils/firebaseStorage';

const BlogEditorPage = () => {
  const { id } = useParams(); // Will be undefined for new blog
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState({ blocks: [] });
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    if (id) {
      loadBlog();
    }
  }, [id]);

  const loadBlog = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blogs/${id}`);
      const blog = await response.json();
      setTitle(blog.title);
      setContent(blog.content);
      setCoverImage(blog.blog_image || '');
      setStatus(blog.status || 'draft');
      setCategory(blog.category || '');
      setTags(blog.tags || []);
      setMetaDescription(blog.meta_description || '');
    } catch (error) {
      console.error('Error loading blog:', error);
    }
    setLoading(false);
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadToFirebase(file, 'blog-covers', id || 'temp');
      setCoverImage(result.url);
    } catch (error) {
      console.error('Cover upload error:', error);
      alert('Failed to upload cover image');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!content.blocks || content.blocks.length === 0) {
      alert('Please add some content');
      return;
    }

    setSaving(true);
    try {
      const blogData = {
        title,
        slug: generateSlug(title),
        content,
        blog_image: coverImage,
        status: publishNow ? 'published' : status,
        category,
        tags,
        meta_description: metaDescription,
        author: 'Current User', // Replace with actual user
        author_id: 'user123' // Replace with actual user ID
      };

      const url = id ? `/api/blogs/${id}` : '/api/blogs';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(id ? 'Blog updated successfully!' : 'Blog created successfully!');
        navigate(`/blogs/${result.slug}`);
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save blog: ' + error.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/blogs')}
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
            className="w-full text-4xl font-bold text-gray-900 border-none outline-none mb-6 placeholder-gray-400"
          />

          {/* Cover Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            {coverImage ? (
              <div className="relative">
                <img src={coverImage} alt="Cover" className="w-full h-64 object-cover rounded-lg" />
                <button
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Image size={48} className="text-gray-400 mb-2" />
                <span className="text-gray-600">Click to upload cover image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleCoverImageUpload} />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Web Development"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Meta Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (for SEO)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Brief description of your blog post..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
            />
          </div>

          {/* Editor.js */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <EditorJsFirebase
              data={content}
              onChange={setContent}
              blogId={id || 'temp'}
              readOnly={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditorPage;