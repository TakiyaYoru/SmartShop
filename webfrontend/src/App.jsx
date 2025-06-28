// File: webfrontend/src/App.jsx (FIXED COMPLETE VERSION)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; 
import CheckoutPage from './pages/CheckoutPage'; // ✅ THÊM
import OrdersPage from './pages/OrdersPage'; // ✅ THÊM
import OrderDetailPage from './pages/OrderDetailPage'; // ✅ THÊM
import OrderSuccessPage from './pages/OrderSuccessPage'; // ✅ THÊM
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

        {/* ✅ FIX: THÊM CHECKOUT VÀ ORDER ROUTES */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/orders/:orderNumber" 
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } 
        />

        {/* ❌ MISSING: OrderSuccess Route - ĐÂY LÀ ROUTE BỊ THIẾU */}
        <Route 
          path="/order-success/:orderNumber" 
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          } 
        />
        
        {/* ===== ADMIN ROUTES ===== */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/admin/products" 
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProductsPage />
              </AdminLayout>
            </AdminRoute>
          } 
        />
        
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
          path="/admin/products/:id/edit" 
          element={
            <AdminRoute>
              <AdminLayout>
                <EditProductPage />
              </AdminLayout>
            </AdminRoute>
          } 
        />
        
        {/* ===== MANAGER ROUTE (PLACEHOLDER) ===== */}
        <Route 
          path="/manager" 
          element={
            <ManagerRoute>
              <div className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Manager Dashboard 📊
                  </h1>
                  <p className="text-gray-600 mb-4">
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