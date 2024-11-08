import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Filter, Clock, ShieldAlert } from 'lucide-react';
import PostForm from '../components/forum/PostForm';
import PostCard from '../components/forum/PostCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  category: string;
  tags: string[];
  likes: string[];
  comments: Array<{
    _id: string;
    content: string;
    author: {
      _id: string;
      username: string;
    };
    date: string;
  }>;
  date: string;
}

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await axios.get('/api/threads', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Fetched posts:', response.data); // Log the response
        const transformedPosts = response.data.map((post: any) => ({
          ...post,
          author: {
            _id: post.author._id,
            username: post.author.username
          }
        }));
        setPosts(transformedPosts);
        console.log('Posts state updated:', transformedPosts); // Log updated state
      } catch (error: any) {
        console.error('Error fetching posts:', {
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        setError(error.response?.data?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (postData: { title: string; content: string; category: string; tags: string }) => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/threads', 
        {
          title: postData.title,
          content: postData.content,
          category: postData.category || 'General Discussion',
          tags: postData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('New post response:', response.data);
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setError(null);
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/threads/${postId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === postId ? response.data : post)
      );
      setError(null);
    } catch (error: any) {
      console.error('Error liking post:', error);
      setError(error.response?.data?.message || 'Failed to like post');
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    if (!user || !comment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/threads/${postId}/comment`, 
        { content: comment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === postId ? response.data : post)
      );
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      setError(null);
    } catch (error: any) {
      console.error('Error commenting on post:', error);
      setError(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleReply = async (postId: string, commentId: string, content: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/threads/${postId}/comments/${commentId}/reply`,
        { content },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === postId ? response.data : post)
      );
    } catch (error: any) {
      console.error('Error replying to comment:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to add reply');
      }
    }
  };

  const filteredPosts = posts
    .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.likes.length - a.likes.length;
    });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

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
        {filteredPosts.map((post) => {
          console.log('Post props:', post); // Log each post
          return (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onReply={(commentId, content) => handleReply(post._id, commentId, content)}
              currentUser={user}
              newComment={newComment[post._id] || ''}
              onCommentChange={(id, value) => setNewComment({ ...newComment, [id]: value })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Forum;