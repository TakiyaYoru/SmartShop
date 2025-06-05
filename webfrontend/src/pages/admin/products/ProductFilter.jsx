// src/components/admin/products/ProductFilter.jsx
import React from 'react';

const ProductFilter = ({ onFilterChange, className = '' }) => {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <p className="text-sm text-gray-600">
        🚧 Bộ lọc chi tiết đang phát triển. Hiện tại có thể dùng search và sort ở trên.
      </p>
    </div>
  );
};

export default ProductFilter;