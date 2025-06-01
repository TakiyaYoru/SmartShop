import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Search, ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([
    { _id: '1', name: 'Smartphones' },
    { _id: '2', name: 'Laptops' },
    { _id: '3', name: 'Smart Home' },
    { _id: '4', name: 'Wearables' },
    { _id: '5', name: 'Accessories' }
  ]);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      {/* Top bar */}
      <div className="bg-blue-600 text-white px-4 py-1.5 text-sm">
        <div className="container-custom flex justify-center md:justify-between items-center">
          <p className="hidden md:block">Free shipping on orders over $50</p>
          <div className="flex space-x-4">
            <Link to="/help" className="hover:text-blue-100">Help Center</Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-blue-100">Contact Us</Link>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              className="mr-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>
          
          {/* Search bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
          
          {/* User actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile search */}
            <Link to="/search" className="md:hidden">
              <Search size={22} />
            </Link>
            
            {/* User account */}
            <div className="relative" ref={userMenuRef}>
              <button 
                className="flex items-center hover:text-blue-600"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={22} className="mr-1" />
                <span className="hidden lg:inline">
                  {isAuthenticated ? user?.firstName || 'Account' : 'Account'}
                </span>
              </button>
              
              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                        <div className="text-gray-500 text-xs mt-1 truncate">{user?.email}</div>
                      </div>
                      {isAdmin && (
                        <Link 
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <LayoutDashboard size={16} className="mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        onClick={logout}
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Cart */}
            <Link to="/cart" className="relative hover:text-blue-600 flex items-center">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="hidden lg:inline ml-1">Cart</span>
            </Link>
          </div>
        </div>
        
        {/* Category navigation */}
        <nav className="hidden md:flex mt-4 space-x-6 border-t pt-4">
          {categories.map(category => (
            <Link
              key={category._id}
              to={`/category/${category._id}`}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>
        
        {/* Mobile search - visible only on mobile */}
        <form 
          onSubmit={handleSearch}
          className="mt-4 md:hidden"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit"
              className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-600"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
};

export default Header;