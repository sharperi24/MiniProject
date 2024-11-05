import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface PostFormProps {
  onSubmit: (post: { title: string; content: string; category: string; tags: string }) => void;
  categories: string[];
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, categories }) => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: 'General Discussion',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(post);
    setPost({ title: '', content: '', category: 'General Discussion', tags: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Share Your Thoughts</h2>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
          <p className="text-blue-700 font-medium">Community Guidelines</p>
        </div>
        <p className="text-blue-600 text-sm">
          This is a safe space for everyone. Please be respectful, supportive, and mindful of others' experiences.
        </p>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Give your discussion a clear, respectful title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          required
        />
      </div>
      <div className="mb-4">
        <select
          value={post.category}
          onChange={(e) => setPost({ ...post, category: e.target.value })}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Add relevant tags (comma-separated)"
          value={post.tags}
          onChange={(e) => setPost({ ...post, tags: e.target.value })}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Share your thoughts in a respectful and constructive way..."
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          className="w-full p-3 border rounded-md h-32 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Share with the Community
      </button>
    </form>
  );
};

export default PostForm;