import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PRODUCTS, DELETE_PRODUCT, GET_CATEGORIES_FOR_SELECT } from '../../graphql/productQueries';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/format';

const ITEMS_PER_PAGE = 10;

const ProductListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterActive, setFilterActive] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('CREATED_DESC');

  // Query products with pagination and filters
  const { loading, error, data, refetch } = useQuery(GET_ALL_PRODUCTS, {
    variables: {
      first: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: sortOrder,
      condition: {
        name: searchQuery || undefined,
        category: selectedCategory || undefined,
        isActive: filterActive
      }
    },
    onError: (error) => {
      console.error('GraphQL Error:', error);
      console.error('GraphQL Error Message:', error.message);
      console.error('GraphQL Error Network:', error.networkError);
      console.error('GraphQL Error GraphQL:', error.graphQLErrors);
    }
  });

  // Query categories for filter dropdown
  const { data: categoriesData } = useQuery(GET_CATEGORIES_FOR_SELECT);

  // Delete mutation
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: (data) => {
      if (data.deleteProduct) {
        toast.success('Product deleted successfully');
        refetch();
      } else {
        toast.error('Failed to delete product');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Error deleting product');
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch({
      first: ITEMS_PER_PAGE,
      offset: 0,
      orderBy: sortOrder,
      condition: {
        name: searchQuery || undefined,
        category: selectedCategory || undefined,
        isActive: filterActive
      }
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct({
          variables: { id }
        });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleActiveFilterChange = (e) => {
    const value = e.target.value;
    setFilterActive(value === 'all' ? undefined : value === 'active');
    setCurrentPage(1);
    refetch({
      first: ITEMS_PER_PAGE,
      offset: 0,
      orderBy: sortOrder,
      condition: {
        name: searchQuery || undefined,
        category: selectedCategory || undefined,
        isActive: value === 'all' ? undefined : value === 'active'
      }
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setCurrentPage(1);
    refetch({
      first: ITEMS_PER_PAGE,
      offset: 0,
      orderBy: sortOrder,
      condition: {
        name: searchQuery || undefined,
        category: value || undefined,
        isActive: filterActive
      }
    });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    refetch({
      first: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: value,
      condition: {
        name: searchQuery || undefined,
        category: selectedCategory || undefined,
        isActive: filterActive
      }
    });
  };

  // Get products from the new schema
  const products = data?.products?.nodes || [];
  const totalItems = data?.products?.totalCount || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    refetch({
      first: ITEMS_PER_PAGE,
      offset: (newPage - 1) * ITEMS_PER_PAGE,
      orderBy: sortOrder,
      condition: {
        name: searchQuery || undefined,
        category: selectedCategory || undefined,
        isActive: filterActive
      }
    });
  };

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading products: {error.message}
      </div>
    );
  }

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
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Search */}
          <div className="md:w-1/3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
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
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categoriesData?.allCategories?.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
              onChange={handleActiveFilterChange}
              className="py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="CREATED_DESC">Newest First</option>
              <option value="CREATED_ASC">Oldest First</option>
              <option value="NAME_ASC">Name A-Z</option>
              <option value="NAME_DESC">Name Z-A</option>
              <option value="PRICE_ASC">Price Low-High</option>
              <option value="PRICE_DESC">Price High-Low</option>
              <option value="STOCK_ASC">Stock Low-High</option>
              <option value="STOCK_DESC">Stock High-Low</option>
            </select>
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
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
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
                  <tr key={product._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {product.category.name}
                      </div>
                      {product.brand && (
                        <div className="text-sm text-gray-500">
                          {product.brand}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        product.stock > 10 
                          ? 'text-green-600' 
                          : product.stock > 0 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {product.isFeatured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium space-x-2">
                      <Link 
                        to={`/admin/products/edit/${product._id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash size={16} className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;