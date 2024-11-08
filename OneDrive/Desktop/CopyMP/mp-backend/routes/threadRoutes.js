import express from 'express';
import { createThread, getThreads, likeThread, commentOnThread, addReplyToComment } from '../controllers/threadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createThread) // Ensure this route is defined
  .get(getThreads); // Get all threads

router.route('/:id/like')
  .put(protect, likeThread); // Like a thread

router.route('/:id/comment')
  .post(protect, commentOnThread); // Comment on a thread

router.route('/:threadId/comments/:commentId/reply')
  .post(protect, addReplyToComment); // Reply to a comment

export default router;