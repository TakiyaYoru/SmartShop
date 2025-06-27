// ===== CURRENT ROUTING STATUS =====

// ❌ MISSING ROUTES for Forgot Password feature:

// 1. IN App.jsx - MISSING:
//    - import ForgotPasswordPage
//    - <Route path="/forgot-password" element={<ForgotPasswordPage />} />

// ===== COMPLETE ROUTER FIX =====
// File: webfrontend/src/App.jsx (FINAL COMPLETE VERSION)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // ← MISSING IMPORT
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; 
import NotFoundPage from './pages/NotFoundPage';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import CreateProductPage from './pages/admin/CreateProductPage';
import EditProductPage from './pages/admin/EditProductPage';

// Protected Routes
import ProtectedRoute, { AdminRoute, ManagerRoute } from './components/auth/ProtectedRoute';

function App() {
  const { loading } = useAuth();

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
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* ❌ MISSING: Forgot Password Route */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* ===== PROTECTED CUSTOMER ROUTES ===== */}
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
        
        <Route 
          path="/products/:id" 
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Placeholder customer pages */}
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
                    <p className="text-gray-600">Trang thương hiệu sẽ được phát triển ở phần tiếp theo! 🏷️</p>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />

        {/* ===== ADMIN ROUTES ===== */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
          
          {/* Placeholder admin routes */}
          <Route path="categories" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Categories</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Categories management will be implemented soon! 📂</p>
              </div>
            </div>
          } />
          
          <Route path="brands" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Brands</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Brands management will be implemented soon! 🏷️</p>
              </div>
            </div>
          } />
          
          <Route path="orders" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Orders</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Orders management will be implemented soon! 📦</p>
              </div>
            </div>
          } />
          
          <Route path="users" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Users</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Users management will be implemented soon! 👥</p>
              </div>
            </div>
          } />
          
          <Route path="reports" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Reports</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Reports will be implemented soon! 📊</p>
              </div>
            </div>
          } />
          
          <Route path="settings" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Settings</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Settings panel will be implemented soon! ⚙️</p>
              </div>
            </div>
          } />
        </Route>

        {/* ===== MANAGER ROUTES ===== */}
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
        
        {/* ===== 404 PAGE ===== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;