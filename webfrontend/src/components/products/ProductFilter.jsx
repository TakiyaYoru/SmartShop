// src/components/products/ProductFilter.jsx - Hoàn thiện code
import React, { useState, useEffect } from 'react';
import { useCategories, useBrands } from '../../hooks/useProducts';
import { 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  TagIcon,
  StarIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const ProductFilter = ({ 
  onFilterChange, 
  initialFilters = {},
  className = '' 
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { brands, loading: brandsLoading } = useBrands();
  
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    categories: [],
    brands: [],
    rating: '',
    inStock: false,
    isFeatured: false,
    ...initialFilters
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    brands: true,
    features: true,
    rating: true
  });

  // Predefined price ranges
  const priceRanges = [
    { label: 'Dưới 1 triệu', min: 0, max: 1000000, icon: '💸' },
    { label: '1 - 5 triệu', min: 1000000, max: 5000000, icon: '💰' },
    { label: '5 - 10 triệu', min: 5000000, max: 10000000, icon: '💎' },
    { label: '10 - 20 triệu', min: 10000000, max: 20000000, icon: '👑' },
    { label: 'Trên 20 triệu', min: 20000000, max: null, icon: '🏆' }
  ];

  const ratings = [
    { label: '5 sao', value: 5, stars: '★★★★★', color: 'text-yellow-400' },
    { label: '4 sao trở lên', value: 4, stars: '★★★★☆', color: 'text-yellow-400' },
    { label: '3 sao trở lên', value: 3, stars: '★★★☆☆', color: 'text-yellow-400' },
    { label: '2 sao trở lên', value: 2, stars: '★★☆☆☆', color: 'text-yellow-400' }
  ];

  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceRangeSelect = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min: range.min || '', max: range.max || '' }
    }));
  };

  const handleCustomPriceChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: value
      }
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleBrandToggle = (brandId) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId]
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFilters(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? '' : rating
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      categories: [],
      brands: [],
      rating: '',
      inStock: false,
      isFeatured: false
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.priceRange.min || 
      filters.priceRange.max || 
      filters.categories.length > 0 || 
      filters.brands.length > 0 || 
      filters.rating || 
      filters.inStock || 
      filters.isFeatured
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.rating) count++;
    if (filters.inStock) count++;
    if (filters.isFeatured) count++;
    return count;
  };

  const FilterSection = ({ title, children, sectionKey, count = 0, icon = null }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center">
          {icon && <span className="text-lg mr-2">{icon}</span>}
          <span className="font-semibold text-gray-900">{title}</span>
          {count > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              {count}
            </span>
          )}
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="pb-4 px-1">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white">
            <FunnelIcon className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Bộ lọc sản phẩm</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-white/80 hover:text-white text-sm font-medium flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Price Range Filter */}
        <FilterSection 
          title="Khoảng giá" 
          sectionKey="price"
          count={filters.priceRange.min || filters.priceRange.max ? 1 : 0}
          icon="💰"
        >
          <div className="space-y-3">
            {/* Predefined ranges */}
            <div className="grid grid-cols-1 gap-2">
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="priceRange"
                      className="sr-only"
                      checked={
                        filters.priceRange.min === range.min && 
                        filters.priceRange.max === range.max
                      }
                      onChange={() => handlePriceRangeSelect(range)}
                    />
                    <div className={`w-4 h-4 border-2 rounded transition-colors ${
                      filters.priceRange.min === range.min && filters.priceRange.max === range.max
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {filters.priceRange.min === range.min && filters.priceRange.max === range.max && (
                        <CheckIcon className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 flex items-center">
                    <span className="mr-1">{range.icon}</span>
                    {range.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom range */}
            <div className="pt-3 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng giá tùy chỉnh
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    placeholder="Từ"
                    value={filters.priceRange.min}
                    onChange={(e) => handleCustomPriceChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filters.priceRange.max}
                    onChange={(e) => handleCustomPriceChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Categories Filter */}
        <FilterSection 
          title="Danh mục" 
          sectionKey="categories"
          count={filters.categories.length}
          icon="📂"
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categoriesLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <label key={category._id} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={filters.categories.includes(category._id)}
                      onChange={() => handleCategoryToggle(category._id)}
                    />
                    <div className={`w-4 h-4 border-2 rounded transition-colors ${
                      filters.categories.includes(category._id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {filters.categories.includes(category._id) && (
                        <CheckIcon className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {category.name}
                  </span>
                </label>
              ))
            )}
          </div>
        </FilterSection>

        {/* Brands Filter */}
        <FilterSection 
          title="Thương hiệu" 
          sectionKey="brands"
          count={filters.brands.length}
          icon="🏪"
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brandsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              brands.map((brand) => (
                <label key={brand._id} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={filters.brands.includes(brand._id)}
                      onChange={() => handleBrandToggle(brand._id)}
                    />
                    <div className={`w-4 h-4 border-2 rounded transition-colors ${
                      filters.brands.includes(brand._id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {filters.brands.includes(brand._id) && (
                        <CheckIcon className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {brand.name}
                  </span>
                </label>
              ))
            )}
          </div>
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection 
          title="Đánh giá" 
          sectionKey="rating"
          count={filters.rating ? 1 : 0}
          icon="⭐"
        >
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label key={rating.value} className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="rating"
                    className="sr-only"
                    checked={filters.rating === rating.value}
                    onChange={() => handleRatingChange(rating.value)}
                  />
                  <div className={`w-4 h-4 border-2 rounded transition-colors ${
                    filters.rating === rating.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {filters.rating === rating.value && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 flex items-center">
                  <span className={`mr-2 ${rating.color}`}>
                    {rating.stars}
                  </span>
                  {rating.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Features Filter */}
        <FilterSection 
          title="Tính năng đặc biệt" 
          sectionKey="features"
          count={(filters.inStock ? 1 : 0) + (filters.isFeatured ? 1 : 0)}
          icon="✨"
        >
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.inStock}
                  onChange={() => handleFeatureToggle('inStock')}
                />
                <div className={`w-4 h-4 border-2 rounded transition-colors ${
                  filters.inStock
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300 group-hover:border-green-400'
                }`}>
                  {filters.inStock && (
                    <CheckIcon className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 flex items-center">
                <span className="mr-2">✅</span>
                Còn hàng
              </span>
            </label>
            
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.isFeatured}
                  onChange={() => handleFeatureToggle('isFeatured')}
                />
                <div className={`w-4 h-4 border-2 rounded transition-colors ${
                  filters.isFeatured
                    ? 'border-yellow-500 bg-yellow-500'
                    : 'border-gray-300 group-hover:border-yellow-400'
                }`}>
                  {filters.isFeatured && (
                    <CheckIcon className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 flex items-center">
                <span className="mr-2">⭐</span>
                Sản phẩm nổi bật
              </span>
            </label>
          </div>
        </FilterSection>
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={() => onFilterChange?.(filters)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <FunnelIcon className="w-4 h-4 mr-2 inline" />
          Áp dụng bộ lọc
          {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
        </button>
        
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="w-full mt-2 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <XMarkIcon className="w-4 h-4 mr-2 inline" />
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Quick Filter Tips */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <SparklesIcon className="w-4 w-4 mr-2 text-blue-500" />
          Gợi ý lọc nhanh
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => setFilters(prev => ({ ...prev, isFeatured: true, rating: 4 }))}
            className="w-full text-left px-3 py-2 text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-lg hover:from-yellow-200 hover:to-orange-200 transition-all duration-200 flex items-center"
          >
            <span className="mr-2">⭐</span>
            Sản phẩm nổi bật + Đánh giá cao
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, priceRange: { min: 0, max: 1000000 }, inStock: true }))}
            className="w-full text-left px-3 py-2 text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg hover:from-green-200 hover:to-emerald-200 transition-all duration-200 flex items-center"
          >
            <span className="mr-2">💸</span>
            Giá rẻ + Còn hàng
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, rating: 4 }))}
            className="w-full text-left px-3 py-2 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-200 flex items-center"
          >
            <span className="mr-2">⭐</span>
            Đánh giá 4 sao trở lên
          </button>
        </div>

        {hasActiveFilters() && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
              <strong>💡 Mẹo:</strong> Đang áp dụng {getActiveFiltersCount()} bộ lọc. 
              Kết quả sẽ hiển thị sản phẩm phù hợp nhất với tiêu chí của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;