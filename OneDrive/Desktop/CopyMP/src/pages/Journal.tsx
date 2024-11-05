import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Book, Trash2 } from 'lucide-react';

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  userId: string;
}

const Journal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('journal-entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    localStorage.setItem('journal-entries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newEntry.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: newEntry,
      date: new Date().toISOString(),
      userId: user.id,
    };

    setEntries([entry, ...entries]);
    setNewEntry('');
  };

  const handleDelete = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const userEntries = entries.filter(entry => entry.userId === user?.id);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Book className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Please login to access your journal
        </h2>
        <p className="text-gray-600">
          Your personal journal is waiting for your thoughts and reflections
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">New Journal Entry</h2>
        <div className="mb-4">
          <textarea
            placeholder="Write your thoughts..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="w-full p-4 border rounded-md h-40"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Save Entry
        </button>
      </form>

      <div className="space-y-6">
        {userEntries.map((entry) => (
          <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-500">
                {new Date(entry.date).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;