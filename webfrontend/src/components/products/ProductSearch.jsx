// src/components/products/ProductSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  FireIcon // Thay thế TrendingUpIcon bằng FireIcon
} from '@heroicons/react/24/outline';
import { useSearchProducts } from '../../hooks/useProducts';
import { formatPrice, getImageUrl } from '../../lib/utils';

const ProductSearch = ({ 
  placeholder = "Tìm kiếm sản phẩm...",
  className = "",
  showSuggestions = true,
  onSearchSubmit
}) => {
  const navigate = useNavigate();
  const { searchResults, isSearching, search, clearSearch } = useSearchProducts();
  
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState([
    'iPhone 15', 'MacBook Pro', 'Samsung Galaxy', 'AirPods', 'iPad'
  ]);

  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('smartshop_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    const updated = [
      searchQuery,
      ...recentSearches.filter(item => item !== searchQuery)
    ].slice(0, 5); // Keep only 5 recent searches
    
    setRecentSearches(updated);
    localStorage.setItem('smartshop_recent_searches', JSON.stringify(updated));
  };

  // Handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 2) {
      search(value, { first: 5 }); // Search with limit for suggestions
      setShowResults(true);
    } else {
      clearSearch();
      setShowResults(value.length > 0);
    }
  };

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const performSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    saveRecentSearch(searchQuery.trim());
    setShowResults(false);
    setQuery(searchQuery);
    
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const handleClear = () => {
    setQuery('');
    clearSearch();
    setShowResults(false);
  };

  // Remove recent search item
  const removeRecentSearch = (item) => {
    const updated = recentSearches.filter(search => search !== item);
    setRecentSearches(updated);
    localStorage.setItem('smartshop_recent_searches', JSON.stringify(updated));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowResults(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            autoComplete="off"
          />
          
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showSuggestions && showResults && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
        >
          {/* Loading */}
          {isSearching && query.length > 2 && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Đang tìm kiếm...</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && query.length > 2 && (
            <div>
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Sản phẩm</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {product.brand?.name} • {product.category?.name}
                      </p>
                      <p className="text-sm font-semibold text-red-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* View all results */}
              <div className="border-t border-gray-100">
                <button
                  onClick={() => performSearch(query)}
                  className="w-full px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Xem tất cả kết quả cho "{query}"
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {searchResults.length === 0 && query.length > 2 && !isSearching && (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">
                Không tìm thấy sản phẩm nào cho "{query}"
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {(!query || query.length <= 2) && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Tìm kiếm gần đây
                </h3>
              </div>
              <div>
                {recentSearches.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                  >
                    <button
                      onClick={() => {
                        setQuery(item);
                        performSearch(item);
                      }}
                      className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900"
                    >
                      {item}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(item)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {(!query || query.length <= 2) && trendingSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <FireIcon className="h-4 w-4 mr-2" />
                  Tìm kiếm phổ biến
                </h3>
              </div>
              <div>
                {trendingSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(item);
                      performSearch(item);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!query || query.length <= 2) && recentSearches.length === 0 && (
            <div className="p-6 text-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Nhập từ khóa để tìm kiếm sản phẩm
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;