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
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const newComment = {
      content: req.body.content,
      author: req.user._id,
      date: new Date()
    };

    thread.comments.push(newComment);
    await thread.save();

    const populatedThread = await Thread.findById(thread._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');

    res.json(populatedThread);
  } catch (error) {
    console.error('Error in commentOnThread:', error);
    res.status(500).json({ message: 'Error commenting on thread', error: error.message });
  }
};

// Add reply to comment
export const addReplyToComment = async (req, res) => {
  try {
    const { threadId, commentId } = req.params;
    const { content } = req.body;

    const thread = await Thread.findById(threadId);
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

    const updatedThread = await Thread.findById(threadId)
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .populate('comments.replies.author', 'username');

    res.json(updatedThread);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Error adding reply', error: error.message });
  }
};