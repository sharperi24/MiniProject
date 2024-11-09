
import { Link } from 'react-router-dom';
import { MessageCircle, Book, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to DevForum
        </h1>
        <p className="text-xl text-gray-600">
          A community platform for developers to discuss, learn, and grow together
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          to="/forum"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <MessageCircle className="w-12 h-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Discussion Forum</h2>
          <p className="text-gray-600">
            Join conversations, ask questions, and share your knowledge
          </p>
        </Link>

        <Link
          to="/journal"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Book className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Personal Journal</h2>
          <p className="text-gray-600">
            Keep track of your learning journey and daily discoveries
          </p>
        </Link>

        <Link
          to="/resources"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <BookOpen className="w-12 h-12 text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Resources</h2>
          <p className="text-gray-600">
            Access curated learning materials and helpful links
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Home;