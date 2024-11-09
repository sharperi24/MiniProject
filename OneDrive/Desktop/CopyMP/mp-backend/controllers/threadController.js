import Thread from '../models/Thread.js';

// Create a new thread
export const createThread = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    console.log('Creating thread with data:', { title, content, category, tags });

    const newThread = await Thread.create({
      title,
      content,
      author: req.user._id,
      category,
      tags: tags || [],
      date: new Date()
    });

    const populatedThread = await Thread.findById(newThread._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');

    console.log('Created thread:', populatedThread);
    res.status(201).json(populatedThread);
  } catch (error) {
    console.error('Error in createThread:', error);
    res.status(500).json({ message: 'Error creating thread', error: error.message });
  }
};

// Get all threads
export const getThreads = async (req, res) => {
  try {
    console.log('Fetching threads...');
    const threads = await Thread.find()
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .populate('comments.replies.author', 'username')
      .sort({ date: -1 });
    
    console.log(`Found ${threads.length} threads`);
    res.json(threads);
  } catch (error) {
    console.error('Error in getThreads:', error);
    res.status(500).json({ 
      message: 'Error fetching threads', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Like/unlike a thread
export const likeThread = async (req, res) => {
  try {
    console.log('Like request received for thread:', req.params.id);
    console.log('User:', req.user._id);

    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if the user has already liked the thread
    const likeIndex = thread.likes.findIndex(
      like => like.toString() === req.user._id.toString()
    );

    console.log('Current likes:', thread.likes);
    console.log('Like index:', likeIndex);

    if (likeIndex === -1) {
      // User hasn't liked the thread yet, so add the like
      thread.likes.push(req.user._id);
      console.log('Like added');
    } else {
      // User has already liked the thread, so remove the like
      thread.likes.splice(likeIndex, 1);
      console.log('Like removed');
    }

    await thread.save();
    console.log('Thread saved with updated likes:', thread.likes);

    // Populate the thread with user details before sending response
    const populatedThread = await Thread.findById(thread._id)
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .populate('likes', 'username'); // Add this line to populate likes

    res.json(populatedThread);
  } catch (error) {
    console.error('Error in likeThread:', error);
    res.status(500).json({ 
      message: 'Error updating like',
      error: error.message 
    });
  }
};

// Add a comment to a thread
export const commentOnThread = async (req, res) => {
  try {
    const { content } = req.body;
    const thread = await Thread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const newComment = {
      content,
      author: req.user._id,
      date: new Date(),
      replies: [] // Initialize replies as an empty array
    };

    thread.comments.push(newComment); // Add the new comment to the thread's comments
    await thread.save(); // Save the updated thread

    // Populate the thread with the new comment's author details
    const populatedThread = await Thread.findById(thread._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');

    res.json(populatedThread); // Return the updated thread
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Add reply to comment
export const addReplyToComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { content } = req.body;

    console.log('Adding reply:', {
      threadId: id,
      commentId,
      content,
      user: req.user._id
    });

    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const comment = thread.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({
      content,
      author: req.user._id,
      date: new Date()
    });

    await thread.save();

    const updatedThread = await Thread.findById(id)
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .populate('comments.replies.author', 'username');

    console.log('Reply added successfully');
    res.json(updatedThread);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Error adding reply', error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { threadId, commentId } = req.params;
    console.log('Attempting to delete comment:', {
      threadId,
      commentId,
      userId: req.user._id
    });

    // Verify the thread exists
    const thread = await Thread.findById(threadId);
    if (!thread) {
      console.log('Thread not found:', threadId);
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Find the comment
    const commentIndex = thread.comments.findIndex(c => c._id.toString() === commentId);
    if (commentIndex === -1) {
      console.log('Comment not found:', commentId);
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verify ownership
    if (thread.comments[commentIndex].author.toString() !== req.user._id.toString()) {
      console.log('Authorization failed - user does not own comment');
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove the comment
    thread.comments.splice(commentIndex, 1);
    await thread.save();

    // Return updated thread with populated fields
    const updatedThread = await Thread.findById(threadId)
      .populate('author', 'username')
      .populate('comments.author', 'username');

    console.log('Comment deleted successfully');
    res.json(updatedThread);
  } catch (error) {
    console.error('Error in deleteComment:', error);
    res.status(500).json({ 
      message: 'Error deleting comment',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a thread
export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if the user is authorized to delete the thread
    if (thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this thread' });
    }

    await Thread.findByIdAndDelete(req.params.id);
    console.log('Thread deleted successfully');
    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Error deleting thread:', error);
    res.status(500).json({ message: 'Error deleting thread', error: error.message });
  }
};

// Flag a thread
export const flagThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const alreadyFlagged = thread.flags.some(
      flag => flag.user.toString() === req.user._id.toString()
    );

    if (alreadyFlagged) {
      return res.status(400).json({ message: 'Thread already flagged' });
    }

    thread.flags.push({
      user: req.user._id,
      reason: req.body.reason,
      date: new Date()
    });

    await thread.save();
    res.json({ message: 'Thread flagged' });
  } catch (error) {
    console.error('Error flagging thread:', error);
    res.status(500).json({ message: 'Error flagging thread', error: error.message });
  }
};