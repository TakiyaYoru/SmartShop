// src/components/products/ProductFilter.jsx
import React, { useState, useEffect } from 'react';
import { useCategories, useBrands } from '../../hooks/useProducts';
import { 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon 
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
    features: true
  });

  // Predefined price ranges
  const priceRanges = [
    { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
    { label: '1 - 5 triệu', min: 1000000, max: 5000000 },
    { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
    { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
    { label: 'Trên 20 triệu', min: 20000000, max: null }
  ];

  const ratings = [
    { label: '5 sao', value: 5 },
    { label: '4 sao trở lên', value: 4 },
    { label: '3 sao trở lên', value: 3 },
    { label: '2 sao trở lên', value: 2 }
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

  const FilterSection = ({ title, children, sectionKey, count = 0 }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-900">{title}</span>
          {count > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
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
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
          </div>
          
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
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
        >
          <div className="space-y-3">
            {/* Predefined ranges */}
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={
                      filters.priceRange.min === range.min && 
                      filters.priceRange.max === range.max
                    }
                    onChange={() => handlePriceRangeSelect(range)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>

            {/* Custom range */}
            <div className="pt-3 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tùy chỉnh (VNĐ)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.priceRange.min}
                  onChange={(e) => handleCustomPriceChange('min', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.priceRange.max}
                  onChange={(e) => handleCustomPriceChange('max', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Categories Filter */}
        <FilterSection 
          title="Danh mục" 
          sectionKey="categories"
          count={filters.categories.length}
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
                <label key={category._id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.categories.includes(category._id)}
                    onChange={() => handleCategoryToggle(category._id)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
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
                <label key={brand._id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.brands.includes(brand._id)}
                    onChange={() => handleBrandToggle(brand._id)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{brand.name}</span>
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
        >
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label key={rating.value} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.rating === rating.value}
                  onChange={() => handleRatingChange(rating.value)}
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  {rating.label}
                  <span className="ml-1 text-yellow-400">
                    {'★'.repeat(Math.floor(rating.value))}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Features Filter */}
        <FilterSection 
          title="Tính năng" 
          sectionKey="features"
          count={(filters.inStock ? 1 : 0) + (filters.isFeatured ? 1 : 0)}
        >
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.inStock}
                onChange={() => handleFeatureToggle('inStock')}
              />
              <span className="ml-2 text-sm text-gray-700">Còn hàng</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.isFeatured}
                onChange={() => handleFeatureToggle('isFeatured')}
              />
              <span className="ml-2 text-sm text-gray-700">Sản phẩm nổi bật</span>
            </label>
          </div>
        </FilterSection>
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => onFilterChange?.(filters)}
          className="w-full btn btn-primary"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;