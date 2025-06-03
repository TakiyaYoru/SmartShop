// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import ProductList from '../components/products/ProductList';
import ProductFilter from '../components/products/ProductFilter';
import ProductSearch from '../components/products/ProductSearch';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useProducts } from '../hooks/useProducts';
import { 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('CREATED_DESC');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    categories: [],
    brands: [],
    rating: '',
    inStock: false,
    isFeatured: false
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Get initial search from URL
  const initialSearch = searchParams.get('q') || '';
  
  // Build GraphQL condition từ filters
  const buildCondition = () => {
    const condition = {};
    
    // Price range
    if (filters.priceRange.min || filters.priceRange.max) {
      condition.price = {};
      if (filters.priceRange.min) condition.price.min = parseFloat(filters.priceRange.min);
      if (filters.priceRange.max) condition.price.max = parseFloat(filters.priceRange.max);
    }
    
    // Categories
    if (filters.categories.length > 0) {
      condition.category = filters.categories[0]; // Single category for now
    }
    
    // Brands  
    if (filters.brands.length > 0) {
      condition.brand = filters.brands[0]; // Single brand for now
    }
    
    // Features
    if (filters.isFeatured) {
      condition.isFeatured = true;
    }
    
    // Search term
    if (initialSearch) {
      condition.name = initialSearch;
    }
    
    return Object.keys(condition).length > 0 ? condition : null;
  };

  // Fetch products với GraphQL
  const {
    products,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    loading,
    error,
    loadMore,
    refetch
  } = useProducts({
    first: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    orderBy: sortBy,
    condition: buildCondition(),
    skip: false
  });

  // Sort options
  const sortOptions = [
    { value: 'CREATED_DESC', label: 'Mới nhất' },
    { value: 'CREATED_ASC', label: 'Cũ nhất' },
    { value: 'PRICE_ASC', label: 'Giá thấp đến cao' },
    { value: 'PRICE_DESC', label: 'Giá cao đến thấp' },
    { value: 'NAME_ASC', label: 'Tên A-Z' },
    { value: 'NAME_DESC', label: 'Tên Z-A' },
  ];

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page
  };

  // Handle search from search component
  const handleSearchSubmit = (query) => {
    // Update URL with search params
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1); // Reset to first page
    setShowMobileSearch(false);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Load more for infinite scroll (alternative to pagination)
  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      loadMore();
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      categories: [],
      brands: [],
      rating: '',
      inStock: false,
      isFeatured: false
    });
    setSearchParams({});
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.priceRange.min || 
      filters.priceRange.max || 
      filters.categories.length > 0 || 
      filters.brands.length > 0 || 
      filters.rating || 
      filters.inStock || 
      filters.isFeatured ||
      initialSearch
    );
  };

  // Refetch when dependencies change
  useEffect(() => {
    refetch();
  }, [sortBy, filters, currentPage, refetch]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {initialSearch ? `Kết quả tìm kiếm: "${initialSearch}"` : 'Sản phẩm'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Đang tải...' : `Tìm thấy ${totalCount.toLocaleString()} sản phẩm`}
                </p>
              </div>
              
              {/* Desktop Search */}
              <div className="hidden md:block w-96">
                <ProductSearch 
                  placeholder="Tìm kiếm sản phẩm..."
                  onSearchSubmit={handleSearchSubmit}
                />
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <div className="md:hidden mt-4">
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="w-full btn btn-secondary justify-center"
              >
                🔍 Tìm kiếm sản phẩm
              </button>
              
              {showMobileSearch && (
                <div className="mt-4">
                  <ProductSearch 
                    placeholder="Tìm kiếm sản phẩm..."
                    onSearchSubmit={handleSearchSubmit}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Results Info */}
              <div className="text-sm text-gray-600">
                {totalCount > 0 && (
                  <span>
                    Hiển thị {startItem.toLocaleString()}-{endItem.toLocaleString()} 
                    trong số {totalCount.toLocaleString()} sản phẩm
                  </span>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters() && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center text-sm text-red-600 hover:text-red-700"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sắp xếp:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Lưới"
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Danh sách"
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Bộ lọc</span>
                {hasActiveFilters() && (
                  <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    •
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-8">
                <ProductFilter 
                  onFilterChange={handleFilterChange}
                  initialFilters={filters}
                />
              </div>
            </div>

            {/* Mobile Filters Modal */}
            {showFilters && (
              <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex">
                <div className="bg-white w-80 h-full overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Bộ lọc sản phẩm</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <ProductFilter 
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                  />
                </div>
                <div 
                  className="flex-1" 
                  onClick={() => setShowFilters(false)} 
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-red-600 mr-3">⚠️</div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        Lỗi khi tải sản phẩm
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        {error.message || 'Vui lòng thử lại sau'}
                      </p>
                    </div>
                    <button
                      onClick={() => refetch()}
                      className="ml-auto btn btn-sm btn-secondary"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              )}

              {/* Products List */}
              <ProductList
                products={products}
                loading={loading}
                viewMode={viewMode}
                showLoadMore={false} // We'll use pagination instead
                onLoadMore={handleLoadMore}
                hasNextPage={hasNextPage}
                loadingMore={false}
              />

              {/* Pagination */}
              {totalPages > 1 && !loading && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              )}

              {/* Load More Button (Alternative) */}
              {hasNextPage && products.length > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="btn btn-secondary px-8 py-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Đang tải...
                      </>
                    ) : (
                      'Xem thêm sản phẩm'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProductsPage;