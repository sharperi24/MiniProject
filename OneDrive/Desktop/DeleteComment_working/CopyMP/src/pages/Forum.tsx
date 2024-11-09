import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Filter, Clock, ShieldAlert } from 'lucide-react';
import PostForm from '../components/forum/PostForm';
import PostCard from '../components/forum/PostCard';
import axios from 'axios';

// Define the Reply interface
interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  date: string;
}

const categories = [
  "Support & Encouragement",
  "Personal Growth",
  "Mental Health",
  "Relationships",
  "Career Development",
  "Self-Care Tips",
  "Success Stories"
];

interface ForumPost {
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
    replies: Reply[];
  }>;
  date: string;
}

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          },
          comments: post.comments.map((comment: any) => ({
            ...comment,
            replies: comment.replies || []
          }))
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
          category: postData.category,
          tags: postData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('New post response:', response.data); // Debug log
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

  const handleReply = async (commentId: string, content: string) => {
    if (!user || !content.trim()) return;

    console.log('Replying to comment:', {
      commentId,
      content,
      postId: posts.find(p => p.comments.some(c => c._id === commentId))?._id
    });

    try {
      const token = localStorage.getItem('token');
      const post = posts.find(p => p.comments.some(c => c._id === commentId));

      if (!post) {
        console.error('Post not found for comment:', commentId);
        return;
      }

      const response = await axios.post(
        `/api/threads/${post._id}/comments/${commentId}/reply`,
        { content },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Reply response:', response.data);

      // Update posts state with the new reply
      setPosts(prevPosts =>
        prevPosts.map(p => p._id === post._id ? response.data : p)
      );
    } catch (error: any) {
      console.error('Error replying to comment:', error.response || error);
      setError(error.response?.data?.message || 'Failed to add reply');
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this thread?')) {
      return;
    }

    try {
      await axios.delete(`/api/threads/${threadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Thread deleted successfully');
      // Update the state to remove the deleted thread
      setPosts(prevPosts => prevPosts.filter(post => post._id !== threadId));
    } catch (error: any) {
      console.error('Error deleting thread:', error);
      alert(error.response?.data?.message || 'Failed to delete thread');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const post = posts.find(p => p.comments.some(c => c._id === commentId));
      if (!post) {
        console.error('Post not found for comment:', commentId);
        return;
      }

      console.log('Deleting comment:', {
        postId: post._id,
        commentId: commentId
      });

      const response = await axios.delete(`/api/threads/${post._id}/comments/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update the posts state with the updated thread from response
      setPosts(prevPosts => 
        prevPosts.map(p => p._id === post._id ? response.data : p)
      );

      console.log('Comment deleted successfully');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      alert(error.response?.data?.message || 'Failed to delete comment');
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
              posts={posts}
              setPostsState={setPosts}
              onLike={handleLike}
              onComment={handleComment}
              onReply={handleReply}
              currentUser={user}
              newComment={newComment[post._id] || ''}
              onCommentChange={(id, value) => setNewComment({ ...newComment, [id]: value })}
              onDelete={() => handleDeleteThread(post._id)}
              onDeleteComment={(commentId) => handleDeleteComment(commentId)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Forum;