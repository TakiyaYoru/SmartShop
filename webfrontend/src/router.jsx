// ==========================================
// FILE: webfrontend/src/router.jsx - COMPLETE WITH VNPAY
// ==========================================

import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

// ===== CUSTOMER PAGES =====
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';

// ✅ VNPAY PAGES
import VnpayReturnPage from './pages/VnpayReturnPage';

// ===== ADMIN COMPONENTS =====
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import CreateProductPage from './pages/admin/CreateProductPage';
import EditProductPage from './pages/admin/EditProductPage';

// ✅ ADMIN ORDERS COMPONENTS
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import CreateOrderPage from './pages/admin/CreateOrderPage';

// ===== PROTECTED ROUTES =====
import ProtectedRoute, { AdminRoute, ManagerRoute } from './components/auth/ProtectedRoute';

// Router configuration với future flags
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Create routes
const routes = createRoutesFromElements(
  <Route>
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

    <Route 
      path="/orders/:orderNumber/success" 
      element={
        <ProtectedRoute>
          <OrderSuccessPage />
        </ProtectedRoute>
      } 
    />

    {/* ✅ VNPAY PAYMENT ROUTES */}
    <Route 
      path="/payment/vnpay-return" 
      element={
        <ProtectedRoute>
          <VnpayReturnPage />
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

    {/* ===== PRODUCTS MANAGEMENT ===== */}
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

    {/* ===== ORDERS MANAGEMENT ===== */}
    <Route 
      path="/admin/orders" 
      element={
        <AdminRoute>
          <AdminLayout>
            <AdminOrdersPage />
          </AdminLayout>
        </AdminRoute>
      } 
    />

    <Route 
      path="/admin/orders/create" 
      element={
        <AdminRoute>
          <AdminLayout>
            <CreateOrderPage />
          </AdminLayout>
        </AdminRoute>
      } 
    />

    <Route 
      path="/admin/orders/:orderNumber" 
      element={
        <AdminRoute>
          <AdminLayout>
            <AdminOrderDetailPage />
          </AdminLayout>
        </AdminRoute>
      } 
    />

    {/* ===== OTHER ADMIN ROUTES ===== */}
    <Route 
      path="/admin/categories" 
      element={
        <AdminRoute>
          <AdminLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Categories Management</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Categories management will be implemented soon! 📂</p>
              </div>
            </div>
          </AdminLayout>
        </AdminRoute>
      } 
    />
    
    <Route 
      path="/admin/brands" 
      element={
        <AdminRoute>
          <AdminLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Brands Management</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Brands management will be implemented soon! 🏷️</p>
              </div>
            </div>
          </AdminLayout>
        </AdminRoute>
      } 
    />
    
    <Route 
      path="/admin/users" 
      element={
        <AdminRoute>
          <AdminLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Users Management</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Users management will be implemented soon! 👥</p>
              </div>
            </div>
          </AdminLayout>
        </AdminRoute>
      } 
    />
    
    <Route 
      path="/admin/reports" 
      element={
        <AdminRoute>
          <AdminLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Reports will be implemented soon! 📊</p>
              </div>
            </div>
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
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">🛠️ Coming Soon</h3>
                <div className="space-y-3 text-left">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900">📊 Sales Analytics</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Detailed sales reports and analytics dashboard.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900">📦 Inventory Management</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Advanced inventory tracking and management tools.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900">👥 Customer Support</h4>
                    <p className="text-purple-700 text-sm mt-1">
                      Customer support chat tools and ticket management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ManagerRoute>
      } 
    />
    
    {/* ===== 404 PAGE ===== */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

// Create router với configuration
export const router = createBrowserRouter(routes, routerConfig);