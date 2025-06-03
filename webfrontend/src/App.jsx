// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Routes
import ProtectedRoute, { AdminRoute, ManagerRoute } from './components/auth/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  // Show loading while initializing auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang khởi tạo SmartShop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Placeholder pages */}
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Danh mục sản phẩm</h1>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">Trang danh mục sẽ được phát triển ở phần tiếp theo! 📂</p>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/brands" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Thương hiệu</h1>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">Trang thương hiệu sẽ được phát triển ở phần tiếp theo! 🏪</p>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Giỏ hàng</h1>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">Tính năng giỏ hàng sẽ được phát triển ở phần tiếp theo! 🛒</p>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Admin Dashboard
                </h1>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600">
                    Welcome to SmartShop Admin Panel! 🚀
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Admin features will be implemented here.
                  </p>
                </div>
              </div>
            </AdminRoute>
          } 
        />
        
        {/* Manager Routes */}
        <Route 
          path="/manager/*" 
          element={
            <ManagerRoute>
              <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Manager Dashboard
                </h1>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600">
                    Welcome to SmartShop Manager Panel! 📊
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Manager features will be implemented here.
                  </p>
                </div>
              </div>
            </ManagerRoute>
          } 
        />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;