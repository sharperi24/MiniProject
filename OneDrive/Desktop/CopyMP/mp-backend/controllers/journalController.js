import JournalEntry from '../models/JournalEntry.js';

// Create a new journal entry
export const createEntry = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id;

    console.log('Creating entry for user:', userId);
    console.log('Entry data:', { title, content });

    const newEntry = await JournalEntry.create({
      title,
      content,
      userId,
      date: new Date(),
      lastModified: new Date()
    });

    console.log('Entry created:', newEntry);
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ message: 'Error creating entry', error: error.message });
  }
};

// Get all journal entries for a user
export const getEntries = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    console.log('Fetching entries for user:', userId);
    
    const entries = await JournalEntry.find({ userId })
      .sort({ date: -1 }); // Sort by date, newest first
    
    console.log(`Found ${entries.length} entries`);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ message: 'Error fetching entries', error: error.message });
  }
};

// Update a journal entry
export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;

    console.log(`Updating entry ${id} for user ${userId}`);

    const entry = await JournalEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if the entry belongs to the user
    if (entry.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this entry' });
    }

    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      id,
      {
        title,
        content,
        lastModified: new Date()
      },
      { new: true } // Return the updated document
    );

    console.log('Entry updated:', updatedEntry);
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ message: 'Error updating entry', error: error.message });
  }
};

// Delete a journal entry
export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log(`Deleting entry ${id} for user ${userId}`);

    const entry = await JournalEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if the entry belongs to the user
    if (entry.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry' });
    }

    await JournalEntry.findByIdAndDelete(id);
    console.log('Entry deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Error deleting entry', error: error.message });
  }
};
