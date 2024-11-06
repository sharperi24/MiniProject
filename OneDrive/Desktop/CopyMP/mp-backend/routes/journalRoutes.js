import express from 'express';
import { createEntry, getEntries, updateEntry, deleteEntry } from '../controllers/journalController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have an auth middleware

const router = express.Router();

router.route('/')
  .post(protect, createEntry) // Create a new entry
  .get(protect, getEntries); // Get all entries for the user

router.route('/:id')
  .put(protect, updateEntry) // Update an entry
  .delete(protect, deleteEntry); // Delete an entry

export default router; 