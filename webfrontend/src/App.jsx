// src/App.jsx - Updated routing for standalone admin pages
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage'; // Standalone layout
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
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes - Customer */}
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
        
        {/* Placeholder customer pages */}

        <Route 
          path="/products/:id" 
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          } 
        />
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
        
        {/* Standalone Admin Products Page */}
        <Route 
          path="/admin/products" 
          element={
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          } 
        />

        {/* Admin Product Management with shared layout */}
        <Route 
          path="/admin/products/create" 
          element={
            <AdminRoute>
              <AdminLayout>
                <CreateProductPage />
              </AdminLayout>
            </AdminRoute>
          } 
        />

        <Route 
          path="/admin/products/edit/:id" 
          element={
            <AdminRoute>
              <AdminLayout>
                <EditProductPage />
              </AdminLayout>
            </AdminRoute>
          } 
        />

        {/* Other Admin Routes with shared layout */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <Routes>
                <Route path="/" element={<AdminLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="orders" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
                      <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600">Order management will be implemented soon! 📦</p>
                      </div>
                    </div>
                  } />
                  <Route path="categories" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
                      <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600">Category management will be implemented soon! 📂</p>
                      </div>
                    </div>
                  } />
                  <Route path="brands" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Brand Management</h1>
                      <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600">Brand management will be implemented soon! 🏪</p>
                      </div>
                    </div>
                  } />
                  <Route path="users" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">User Management</h1>
                      <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600">User management will be implemented soon! 👥</p>
                      </div>
                    </div>
                  } />
                  <Route path="analytics" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
                      <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600">Analytics dashboard will be implemented soon! 📊</p>
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
              </Routes>
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