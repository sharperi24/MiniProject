import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getThreads,
  createThread,
  deleteThread,
  likeThread,
  commentOnThread,
  addReplyToComment,
  flagThread,
  deleteComment
} from '../controllers/threadController.js';

const router = express.Router();

// Debug middleware - Update to show parsed params
router.use((req, res, next) => {
  console.log('Thread Route Hit:', {
    method: req.method,
    path: req.path,
    params: req.params,
    body: req.body,
    url: req.originalUrl
  });
  next();
});

// Public routes
router.get('/', getThreads);

// Protected routes
router.post('/', protect, createThread);
router.delete('/:id', protect, deleteThread);
router.put('/:id/like', protect, likeThread);
router.post('/:id/comment', protect, commentOnThread);
router.post('/:id/comments/:commentId/reply', protect, addReplyToComment);
router.post('/:id/flag', protect, flagThread);
router.delete('/:threadId/comments/:commentId', protect, async (req, res) => {
  console.log('Delete comment route hit with params:', {
    threadId: req.params.threadId,
    commentId: req.params.commentId
  });
  await deleteComment(req, res);
});

export default router;