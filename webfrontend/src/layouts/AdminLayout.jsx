import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LayoutDashboard, ShoppingBag, List, ChevronDown, ChevronUp, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if user is authorized to access admin pages
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navigationItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <List size={20} /> }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div 
        className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:hidden`}
        onClick={toggleSidebar}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
      </div>

      {/* Mobile sidebar */}
      <aside 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition duration-300 lg:hidden
        `}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <Link to="/" className="text-xl font-bold text-blue-600">SmartShop Admin</Link>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <nav className="mt-5 px-4">
          <div className="space-y-1">
            {navigationItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md 
                  ${location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            onClick={logout}
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-6 border-b">
            <Link to="/" className="text-xl font-bold text-blue-600">SmartShop Admin</Link>
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-4 py-4">
              <div className="space-y-1">
                {navigationItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-md 
                      ${location.pathname === item.path 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="p-4 border-t">
              <button 
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                onClick={logout}
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="w-full">
          <div className="relative z-10 flex h-16 flex-shrink-0 bg-white shadow lg:border-b lg:shadow-none">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-1 justify-between px-4 lg:px-6">
              <div className="flex flex-1 items-center">
                <h1 className="text-lg font-semibold text-gray-700">
                  {navigationItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;