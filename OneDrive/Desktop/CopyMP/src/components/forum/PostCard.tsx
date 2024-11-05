import React from 'react';
import { MessageSquare, ThumbsUp, Tag, Heart, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    likes: string[];
    comments: any[];
    category: string;
    tags: string[];
  };
  onLike: (id: string) => void;
  onComment: (id: string, comment: string) => void;
  currentUser: any;
  newComment: string;
  onCommentChange: (id: string, value: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  currentUser,
  newComment,
  onCommentChange,
}) => {
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
        <span>Shared by {post.author}</span>
        <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center space-x-1 ${
              currentUser && post.likes.includes(currentUser.id)
                ? 'text-red-500'
                : 'text-gray-600'
            } hover:text-red-500 transition-colors`}
          >
            <Heart className="w-5 h-5" />
            <span>{post.likes.length}</span>
          </button>
          <div className="flex items-center space-x-1 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </div>
        </div>
      </div>

      {currentUser && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a supportive comment..."
            value={newComment}
            onChange={(e) => onCommentChange(post.id, e.target.value)}
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          <button
            onClick={() => onComment(post.id, newComment)}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
          >
            Comment
          </button>
        </div>
      )}

      {post.comments.length > 0 && (
        <div className="space-y-4 mt-4 border-t pt-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.author}</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;