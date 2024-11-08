import React, { useState } from 'react';
import { MessageSquare, Heart, Tag, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onReply,
  currentUser,
  newComment,
  onCommentChange,
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

  const isLiked = currentUser && post.likes.includes(currentUser._id);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {post.category}
        </span>
        <button className="text-gray-400 hover:text-red-500" title="Report inappropriate content">
          <Flag className="w-4 h-4" />
        </button>
      </div>
      
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>
      
      {post.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-gray-500" />
          {post.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>Shared by {post.author.username}</span>
        <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLiking || !currentUser}
            className={`flex items-center space-x-1 ${
              isLiked ? 'text-red-500' : 'text-gray-600'
            } hover:text-red-500 transition-colors disabled:opacity-50`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes.length}</span>
          </button>
          <div className="flex items-center space-x-1 text-gray-600">
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
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
            disabled={!newComment.trim()}
          >
            Comment
          </button>
        </form>
      )}

      {post.comments.length > 0 && (
        <div className="space-y-4 mt-4 border-t pt-4">
          {post.comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.author.username}</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
              
              <button
                onClick={() => setShowReplyForm({ 
                  ...showReplyForm, 
                  [comment._id]: !showReplyForm[comment._id] 
                })}
                className="text-sm text-blue-500 mt-2 hover:text-blue-600"
              >
                Reply
              </button>

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
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
                  >
                    Submit Reply
                  </button>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-white p-2 rounded-md border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{reply.author.username}</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(reply.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;