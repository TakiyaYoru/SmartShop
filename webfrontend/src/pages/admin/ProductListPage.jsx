import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Search, Plus, Filter, Eye } from 'lucide-react';

// Sample data - will be replaced with API calls
const sampleProducts = [
  {
    _id: '1',
    name: 'iPhone 13 Pro Max',
    description: 'Apple\'s latest flagship phone with ProMotion display and A15 Bionic chip.',
    price: 1099,
    originalPrice: 1299,
    images: ['https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '1',
    categoryName: 'Smartphones',
    brand: 'Apple',
    sku: 'IP13PM256',
    stock: 15,
    isActive: true,
    isFeatured: true,
    createdAt: '2023-06-15T10:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S21',
    description: 'Flagship Android phone with excellent camera and performance.',
    price: 799,
    originalPrice: 999,
    images: ['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '1',
    categoryName: 'Smartphones',
    brand: 'Samsung',
    sku: 'SGS21-128',
    stock: 20,
    isActive: true,
    isFeatured: false,
    createdAt: '2023-06-10T14:30:00.000Z'
  },
  {
    _id: '3',
    name: 'MacBook Pro 14"',
    description: 'Powerful laptop with M1 Pro chip and amazing battery life.',
    price: 1999,
    originalPrice: 2199,
    images: ['https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '2',
    categoryName: 'Laptops',
    brand: 'Apple',
    sku: 'MBP14-512',
    stock: 5,
    isActive: true,
    isFeatured: true,
    createdAt: '2023-06-05T09:15:00.000Z'
  },
  {
    _id: '4',
    name: 'Google Nest Hub',
    description: 'Smart home assistant with display for your connected home.',
    price: 99,
    originalPrice: 129,
    images: ['https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '3',
    categoryName: 'Smart Home',
    brand: 'Google',
    sku: 'GNH-001',
    stock: 50,
    isActive: true,
    isFeatured: false,
    createdAt: '2023-06-01T16:45:00.000Z'
  },
  {
    _id: '5',
    name: 'Apple Watch Series 7',
    description: 'Advanced health tracking and connectivity on your wrist.',
    price: 399,
    originalPrice: 429,
    images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '4',
    categoryName: 'Wearables',
    brand: 'Apple',
    sku: 'AWS7-41',
    stock: 30,
    isActive: true,
    isFeatured: true,
    createdAt: '2023-05-28T11:20:00.000Z'
  },
  {
    _id: '6',
    name: 'Sony WH-1000XM4',
    description: 'Industry-leading noise cancellation headphones with exceptional sound quality.',
    price: 349,
    originalPrice: 399,
    images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '5',
    categoryName: 'Accessories',
    brand: 'Sony',
    sku: 'SWXM4-BLK',
    stock: 25,
    isActive: false,
    isFeatured: false,
    createdAt: '2023-05-25T13:40:00.000Z'
  }
];

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterActive, setFilterActive] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Sample categories - will be replaced with API calls
  const categories = [
    { _id: '1', name: 'Smartphones' },
    { _id: '2', name: 'Laptops' },
    { _id: '3', name: 'Smart Home' },
    { _id: '4', name: 'Wearables' },
    { _id: '5', name: 'Accessories' }
  ];

  useEffect(() => {
    // Simulate API call to get products
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would be an API call with pagination and filters
        setTimeout(() => {
          let filtered = [...sampleProducts];
          
          // Apply search filter
          if (searchQuery) {
            filtered = filtered.filter(product => 
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          
          // Apply category filter
          if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
          }
          
          // Apply active filter
          if (filterActive !== null) {
            filtered = filtered.filter(product => product.isActive === filterActive);
          }
          
          setProducts(filtered);
          setTotalPages(Math.ceil(filtered.length / 10) || 1);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery, selectedCategory, filterActive, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    // In a real implementation, this would call an API
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log(`Delete product with id: ${id}`);
      
      // Update UI immediately
      setProducts(products.filter(product => product._id !== id));
    }
  };

  const handleFilterChange = (e, setter) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleActiveFilterChange = (e) => {
    const value = e.target.value;
    setFilterActive(value === 'all' ? null : value === 'active');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link 
          to="/admin/products/new" 
          className="btn-primary"
        >
          <Plus size={16} className="mr-1" /> Add New Product
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="md:w-1/3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by name, SKU, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                type="submit"
                className="absolute left-0 top-0 mt-2.5 ml-3 text-gray-400"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange(e, setSelectedCategory)}
                className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
                onChange={handleActiveFilterChange}
                className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-20 mt-2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-10"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.images?.[0] || 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.categoryName}</div>
                      <div className="text-xs text-gray-500">{product.brand}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {product.isFeatured && (
                        <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="text-gray-400 hover:text-gray-600 inline-block"
                        title="View"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-blue-600 hover:text-blue-800 inline-block"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-700 inline-block"
                        title="Delete"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, products.length)} of {products.length} products
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;