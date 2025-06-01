import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../contexts/AuthContext';

const MobileMenu = ({ isOpen, onClose, categories }) => {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Menu */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white overflow-y-auto">
        <div className="px-4 py-5 flex items-center justify-between border-b">
          <Logo />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="pt-2 pb-4">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
            <div className="mt-2 space-y-1">
              {categories.map(category => (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="px-4 py-2 mt-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
            <div className="mt-2 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={onClose}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="px-4 py-2 mt-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Help & Support</h3>
            <div className="mt-2 space-y-1">
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={onClose}
              >
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={onClose}
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;