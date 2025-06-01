import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Search, Plus, Eye } from 'lucide-react';

// Sample data - will be replaced with API calls
const sampleCategories = [
  {
    _id: '1',
    name: 'Smartphones',
    description: 'Latest mobile phones and smartphones from all brands',
    image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true,
    productCount: 12,
    createdAt: '2023-06-15T10:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Laptops',
    description: 'Powerful laptops for work, gaming and creative professionals',
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true,
    productCount: 8,
    createdAt: '2023-06-10T14:30:00.000Z'
  },
  {
    _id: '3',
    name: 'Smart Home',
    description: 'Devices to make your home smarter and more efficient',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true,
    productCount: 15,
    createdAt: '2023-06-05T09:15:00.000Z'
  },
  {
    _id: '4',
    name: 'Wearables',
    description: 'Smartwatches, fitness trackers and wearable tech',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true,
    productCount: 6,
    createdAt: '2023-06-01T16:45:00.000Z'
  },
  {
    _id: '5',
    name: 'Accessories',
    description: 'Headphones, chargers, cases and other accessories',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: false,
    productCount: 20,
    createdAt: '2023-05-25T13:40:00.000Z'
  }
];

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState(null);

  useEffect(() => {
    // Simulate API call to get categories
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would be an API call with filters
        setTimeout(() => {
          let filtered = [...sampleCategories];
          
          // Apply search filter
          if (searchQuery) {
            filtered = filtered.filter(category => 
              category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
          }
          
          // Apply active filter
          if (filterActive !== null) {
            filtered = filtered.filter(category => category.isActive === filterActive);
          }
          
          setCategories(filtered);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [searchQuery, filterActive]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleDelete = (id) => {
    // In a real implementation, this would call an API
    if (window.confirm('Are you sure you want to delete this category?')) {
      console.log(`Delete category with id: ${id}`);
      
      // Update UI immediately
      setCategories(categories.filter(category => category._id !== id));
    }
  };

  const handleActiveFilterChange = (e) => {
    const value = e.target.value;
    setFilterActive(value === 'all' ? null : value === 'active');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Link 
          to="/admin/categories/new" 
          className="btn-primary"
        >
          <Plus size={16} className="mr-1" /> Add New Category
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Search */}
          <div className="md:w-1/3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search categories..."
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
          <div>
            <select
              value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
              onChange={handleActiveFilterChange}
              className="py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
        
        {/* Categories table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
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
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.productCount}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/admin/categories/${category._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/admin/categories/${category._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryListPage;