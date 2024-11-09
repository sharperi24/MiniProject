import { useState } from 'react';
import { MessageSquare, Heart, Tag, Reply} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
// import { COLORS } from '../../styles/theme';


interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  date: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  date: string;
  replies: Reply[];
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  date: string;
  likes: string[];
  comments: Comment[];
  category: string;
  tags: string[];
}

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    author: {
      _id: string;
      username: string;
    };
    date: string;
    likes: string[];
    comments: Comment[];
    category: string;
    tags: string[];
  };
  onLike: (id: string) => Promise<void>;
  onComment: (id: string, comment: string) => void;
  onReply: (commentId: string, content: string) => void;
  currentUser: any;
  newComment: string;
  onCommentChange: (id: string, value: string) => void;
  onDelete: () => void;
  onDeleteComment: (commentId: string) => Promise<void>;
  setPostsState: React.Dispatch<React.SetStateAction<Post[]>>;
  posts: Post[];
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onReply,
  currentUser,
  newComment,
  onCommentChange,
  onDelete,
  // onDeleteComment,
  posts,
  setPostsState,
}) => {
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});
  const [isLiking, setIsLiking] = useState(false);

  const handleReplySubmit = (commentId: string) => {
    if (replyContent[commentId]?.trim()) {
      onReply(commentId, replyContent[commentId]);
      setReplyContent({ ...replyContent, [commentId]: '' });
      setShowReplyForm({ ...showReplyForm, [commentId]: false });
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post._id, newComment);
    }
  };

  const handleLike = async () => {
    if (!currentUser || isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(post._id);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const foundPost = posts.find((p: Post) => p.comments.some((c: Comment) => c._id === commentId));
      if (!foundPost) {
        console.error('Post not found for comment:', commentId);
        return;
      }

      console.log('Deleting comment:', {
        postId: foundPost._id,
        commentId: commentId
      });

      const response = await axios.delete(`/api/threads/${foundPost._id}/comments/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update the posts state with the updated thread from response
      setPostsState((prevPosts: Post[]) => 
        prevPosts.map(p => p._id === foundPost._id ? response.data : p)
      );

      console.log('Comment deleted successfully');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      alert(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const isLiked = currentUser && post.likes.includes(currentUser._id);

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(); // Call the onDelete function
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-forumBackground`}>
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-forumTagText rounded-full text-sm font-medium">
          {post.category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-forumText">{post.title}</h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300">{post.content}</p>
      
      {post.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          {post.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-forumTag dark:bg-gray-700 text-forumTagText rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>Shared by {post.author.username}</span>
        <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
      </div>

      <div className="flex items-center justify-between border-t dark:border-gray-700 pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLiking || !currentUser}
            className={`flex items-center space-x-1 ${
              isLiked ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
            } hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes.length}</span>
          </button>
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            <MessageSquare className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </div>
        </div>
      </div>

      {currentUser && (
        <form onSubmit={handleSubmitComment} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a supportive comment..."
            value={newComment}
            onChange={(e) => onCommentChange(post._id, e.target.value)}
            className="flex-1 p-2 border dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-400 dark:focus:border-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            className="bg-forumButton dark:bg-blue-900/30 text-forumButton text-white px-4 py-2 rounded-md hover:bg-forumButtonHover dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
            disabled={!newComment.trim()}
          >
            Comment
          </button>
        </form>
      )}

      {post.comments.length > 0 && (
        <div className="space-y-4 mt-4 border-t dark:border-gray-700 pt-4">
          {post.comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{comment.author.username}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReplyForm({ 
                    ...showReplyForm, 
                    [comment._id]: !showReplyForm[comment._id] 
                  })}
                  className="text-sm text-forumAccent dark:text-blue-400 mt-2 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  Reply
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-sm bg-red-500 dark:bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                >
                  Delete Comment
                </button>
              </div>

              {showReplyForm[comment._id] && (
                <div className="mt-2 ml-4">
                  <input
                    type="text"
                    value={replyContent[comment._id] || ''}
                    onChange={(e) => setReplyContent({ 
                      ...replyContent, 
                      [comment._id]: e.target.value 
                    })}
                    placeholder="Write a reply..."
                    className="w-full p-2 border dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="mt-1 px-3 py-1 bg-forumButton dark:bg-blue-900/30 text-forumButton text-white rounded-md text-sm hover:bg-forumButtonHover dark:hover:bg-blue-900/50"
                  >
                    Submit Reply
                  </button>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-white dark:bg-gray-700 p-2 rounded-md border dark:border-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{reply.author.username}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(reply.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleDeletePost}
        className="mt-4 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
      >
        Delete Post
      </button>
    </div>
  );
};

export default PostCard;