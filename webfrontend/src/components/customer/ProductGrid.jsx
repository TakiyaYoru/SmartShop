import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading = false, title }) => {
  if (loading) {
    return (
      <div className="my-6">
        {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array(10).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 h-[300px]">
              <div className="animate-pulse h-40 bg-gray-200 rounded mb-4"></div>
              <div className="animate-pulse h-4 bg-gray-200 rounded mb-2"></div>
              <div className="animate-pulse h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="my-6 text-center py-12">
        {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
        <div className="bg-gray-100 p-8 rounded-lg">
          <p className="text-gray-500">No products found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;