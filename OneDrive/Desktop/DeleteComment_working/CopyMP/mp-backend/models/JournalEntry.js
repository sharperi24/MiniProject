import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  title: {
    type: String,
    default: 'Untitled Entry'
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;
