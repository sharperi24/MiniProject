import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Filter, Clock, ShieldAlert } from 'lucide-react';
import PostForm from '../components/forum/PostForm';
import PostCard from '../components/forum/PostCard';

const categories = [
  "Support & Encouragement",
  "Personal Growth",
  "Mental Health",
  "Relationships",
  "Career Development",
  "Self-Care Tips",
  "Success Stories"
];

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: string[];
  comments: Comment[];
  category: string;
  tags: string[];
}

interface Comment {
  id: string;
  content: string;
  author: string;
  date: string;
  likes: string[];
}

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('forum-posts');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    localStorage.setItem('forum-posts', JSON.stringify(posts));
  }, [posts]);

  const handlePostSubmit = (postData: { title: string; content: string; category: string; tags: string }) => {
    if (!user) return;

    const post: Post = {
      id: Date.now().toString(),
      title: postData.title,
      content: postData.content,
      author: user.username,
      date: new Date().toISOString(),
      likes: [],
      comments: [],
      category: postData.category,
      tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    setPosts([post, ...posts]);
  };

  const handleLike = (postId: string) => {
    if (!user) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(user.id)
          ? post.likes.filter(id => id !== user.id)
          : [...post.likes, user.id];
        return { ...post, likes };
      }
      return post;
    }));
  };

  const handleComment = (postId: string, comment: string) => {
    if (!user || !comment.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          content: comment,
          author: user.username,
          date: new Date().toISOString(),
          likes: []
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));

    setNewComment({ ...newComment, [postId]: '' });
  };

  const filteredPosts = posts
    .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.likes.length - a.likes.length;
    });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
          <ShieldAlert className="w-8 h-8 mr-3" />
          <h1 className="text-2xl font-bold">Safe Space Community</h1>
        </div>
        <p className="text-blue-100">
          Welcome to our supportive community. This is a space where you can share, connect, and grow together.
          Please be kind, respectful, and mindful of others' experiences.
        </p>
      </div>

      {user && <PostForm onSubmit={handlePostSubmit} categories={categories} />}

      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <Clock className="w-5 h-5 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
            className="border rounded-md p-2"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Supported</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            currentUser={user}
            newComment={newComment[post.id] || ''}
            onCommentChange={(id, value) => setNewComment({ ...newComment, [id]: value })}
          />
        ))}
      </div>
    </div>
  );
};

export default Forum;