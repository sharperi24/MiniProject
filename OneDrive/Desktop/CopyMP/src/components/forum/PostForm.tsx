import  { useState } from 'react';
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
    <form onSubmit={handleSubmit} className={`mb-8 p-6 rounded-lg shadow-md bg-white dark:bg-forumBackground`}>
      <h2 className={`text-2xl font-bold mb-4 text-forumText`}>Share Your Thoughts</h2>
      <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
          <p className="text-blue-700 dark:text-blue-300 font-medium">Community Guidelines</p>
        </div>
        <p className="text-blue-600 dark:text-blue-300 text-sm">
          This is a safe space for everyone. Please be respectful, supportive, and mindful of others' experiences.
        </p>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Give your discussion a clear, respectful title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className={`w-full p-3 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          required
        />
      </div>
      <div className="mb-4">
        <select
          value={post.category}
          onChange={(e) => setPost({ ...post, category: e.target.value })}
          className="w-full p-3 border dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          className="w-full p-3 border dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Share your thoughts in a respectful and constructive way..."
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          className="w-full p-3 border dark:border-gray-600 rounded-md h-32 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>
      <button
        type="submit"
        className={`bg-forumButton dark:bg-blue-900/30 text-forumButton text-white px-6 py-3 rounded-md transition-colors hover:bg-forumButtonHover dark:hover:bg-blue-900/50`}
      >
        Share with the Community
      </button>
    </form>
  );
};

export default PostForm;