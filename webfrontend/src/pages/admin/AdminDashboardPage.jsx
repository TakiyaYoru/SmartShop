import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, DollarSign, Package, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sample data - would be replaced with API calls
  const sampleProducts = [
    {
      _id: '1',
      name: 'iPhone 13 Pro Max',
      price: 1099,
      stock: 15,
      createdAt: '2023-10-25T15:32:10.000Z'
    },
    {
      _id: '2',
      name: 'Samsung Galaxy S21',
      price: 799,
      stock: 20,
      createdAt: '2023-10-22T09:14:33.000Z'
    },
    {
      _id: '3',
      name: 'MacBook Pro 14"',
      price: 1999,
      stock: 5,
      createdAt: '2023-10-20T11:55:22.000Z'
    },
    {
      _id: '4',
      name: 'Google Nest Hub',
      price: 99,
      stock: 50,
      createdAt: '2023-10-18T14:22:45.000Z'
    }
  ];

  useEffect(() => {
    // Simulate API call to get stats and recent products
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, these would be API calls
        setTimeout(() => {
          setStats({
            totalProducts: 42,
            lowStock: 5,
            totalOrders: 128,
            totalRevenue: 25840.50
          });
          
          setRecentProducts(sampleProducts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm h-32">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm h-72">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-48 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <p className="text-2xl font-semibold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
              <p className="text-2xl font-semibold">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Sales Overview</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 size={64} className="mx-auto mb-2 text-gray-300" />
              <p>Sales chart will be implemented here</p>
              <p className="text-sm">Connect to real data for visualization</p>
            </div>
          </div>
        </div>
        
        {/* Recent Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Recent Products</h3>
            <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentProducts.map(product => (
                  <tr key={product._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link 
                        to={`/admin/products/${product._id}`}
                        className="text-sm text-gray-900 hover:text-blue-600"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm ${product.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/admin/products/new"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 w-fit mb-4">
            <ShoppingBag size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Add New Product</h3>
          <p className="text-sm text-gray-600">
            Create a new product with images, description and pricing.
          </p>
        </Link>
        
        <Link 
          to="/admin/categories/new"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-3 rounded-full bg-green-100 text-green-600 w-fit mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Add New Category</h3>
          <p className="text-sm text-gray-600">
            Create a new category to organize your products effectively.
          </p>
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 w-fit mb-4">
            <DollarSign size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Sales Reports</h3>
          <p className="text-sm text-gray-600">
            View detailed reports about sales, revenue and inventory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;