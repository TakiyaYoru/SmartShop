import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import CreateProductPage from './pages/admin/CreateProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import ProductDetailPage from './pages/ProductDetailPage';

// Protected Routes
import ProtectedRoute, { AdminRoute, ManagerRoute } from './components/auth/ProtectedRoute';

// Router configuration with future flags
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Create routes
const routes = createRoutesFromElements(
  <Route>
    {/* Public Routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    
    {/* Protected Routes */}
    <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
    <Route path="/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
    
    {/* Admin Routes */}
    <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route index element={<DashboardPage />} />
      <Route path="products" element={<AdminProductsPage />} />
      <Route path="products/create" element={<CreateProductPage />} />
      <Route path="products/edit/:id" element={<EditProductPage />} />
    </Route>
    
    {/* Manager Routes */}
    <Route path="/manager/*" element={<ManagerRoute>
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
    </ManagerRoute>} />
    
    {/* 404 Page */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

// Create router with configuration
export const router = createBrowserRouter(routes, routerConfig); 