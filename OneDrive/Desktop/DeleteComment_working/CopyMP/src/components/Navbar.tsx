import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Book, BookOpen, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            DevForum
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/forum" className="flex items-center text-gray-600 hover:text-gray-900">
              <MessageCircle className="w-5 h-5 mr-1" />
              Forum
            </Link>
            <Link to="/journal" className="flex items-center text-gray-600 hover:text-gray-900">
              <Book className="w-5 h-5 mr-1" />
              Journal
            </Link>
            <Link to="/resources" className="flex items-center text-gray-600 hover:text-gray-900">
              <BookOpen className="w-5 h-5 mr-1" />
              Resources
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-1" />
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;