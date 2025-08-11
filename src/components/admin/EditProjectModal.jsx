// src/components/admin/EditProjectModal.jsx

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const CATEGORY_OPTIONS = ['Web App', 'Dashboard', 'Mobile App', 'Website', 'AI/ML'];

const EditProjectModal = ({ project, onClose, onSave }) => {
  // Initial state + sensible defaults
  const [formData, setFormData] = useState({
    ...project,
    category: project?.category || 'Web App',
  });

  // Keep a controlled text input for tags; store array in formData
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(project?.tags) ? project.tags.join(', ') : ''
  );

  // Sync when parent passes a different project
  useEffect(() => {
    setFormData({ ...project, category: project?.category || 'Web App' });
    setTagsInput(Array.isArray(project?.tags) ? project.tags.join(', ') : '');
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-[#1c1c1c] w-full max-w-2xl rounded-lg border border-gray-700 p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Edit Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title + Status + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                required
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status || 'Published'}
                onChange={handleChange}
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500 h-[46px]"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category || 'Web App'}
                onChange={handleChange}
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500 h-[46px]"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              required
              rows="3"
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="e.g., React, Firebase"
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              name="imageURL"
              value={formData.imageURL || ''}
              onChange={handleChange}
              required
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Live Demo Link</label>
              <input
                type="url"
                name="liveLink"
                value={formData.liveLink || ''}
                onChange={handleChange}
                required
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub Link</label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink || ''}
                onChange={handleChange}
                required
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;