// src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon,
  StarIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { formatPrice, getImageUrl, calculateDiscountPercentage } from '../../lib/utils';

const ProductCard = ({ 
  product, 
  viewMode = 'grid', // 'grid' or 'list'
  showQuickActions = true,
  className = '' 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const {
    _id,
    name,
    description,
    price,
    originalPrice,
    images = [],
    stock = 0,
    category,
    brand,
    isFeatured
  } = product;

  // Safe fallbacks for missing data
  const categoryName = category?.name || 'Chưa phân loại';
  const brandName = brand?.name || 'Không xác định';
  const productStock = typeof stock === 'number' ? stock : 0;
  const productPrice = typeof price === 'number' ? price : 0;

  const discount = originalPrice && originalPrice > productPrice 
    ? calculateDiscountPercentage(originalPrice, productPrice) 
    : 0;

  const mainImage = images.length > 0 ? getImageUrl(images[0]) : '/placeholder-product.jpg';

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log('Quick view:', product);
  };

  // Grid view layout
  if (viewMode === 'grid') {
    return (
      <div className={`group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}>
        {/* Image Container */}
        <Link to={`/products/${_id}`} className="block relative overflow-hidden bg-gray-100">
          <div className="aspect-square">
            <img
              src={imageError ? '/placeholder-product.jpg' : mainImage}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isFeatured && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg">
                Nổi bật
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
                -{discount}%
              </span>
            )}
            {productStock === 0 && (
              <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded-lg">
                Hết hàng
              </span>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAddToWishlist}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                title={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleQuickView}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 transition-colors"
                title="Xem nhanh"
              >
                <EyeIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}

          {/* Quick Add to Cart (Bottom overlay) */}
          {showQuickActions && productStock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAddToCart}
                className="w-full btn btn-primary text-sm py-2"
              >
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                Thêm vào giỏ
              </button>
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span title={categoryName}>{categoryName}</span>
            <span title={brandName}>{brandName}</span>
          </div>

          {/* Product Name */}
          <Link 
            to={`/products/${_id}`}
            className="block"
          >
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
          </Link>

          {/* Rating (Mock for now) */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">(4.2)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-red-600">
                {formatPrice(productPrice)}
              </span>
              {originalPrice && originalPrice > productPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              productStock > 10 
                ? 'bg-green-100 text-green-700' 
                : productStock > 0 
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              {productStock > 10 ? 'Còn hàng' : productStock > 0 ? `Còn ${productStock}` : 'Hết hàng'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // List view layout
  return (
    <div className={`group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex">
        {/* Image */}
        <Link to={`/products/${_id}`} className="block relative overflow-hidden bg-gray-100 w-48 flex-shrink-0">
          <div className="aspect-square">
            <img
              src={imageError ? '/placeholder-product.jpg' : mainImage}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isFeatured && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                Nổi bật
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                -{discount}%
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Category & Brand */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span title={categoryName}>{categoryName}</span>
              <span className="mx-2">•</span>
              <span title={brandName}>{brandName}</span>
            </div>

            {/* Product Name */}
            <Link to={`/products/${_id}`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {name}
              </h3>
            </Link>

            {/* Description */}
            {description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {description}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">(4.2) • 156 đánh giá</span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(productPrice)}
              </span>
              {originalPrice && originalPrice > productPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Stock */}
              <span className={`text-sm px-3 py-1 rounded-full ${
                productStock > 10 
                  ? 'bg-green-100 text-green-700' 
                  : productStock > 0 
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}>
                {productStock > 10 ? 'Còn hàng' : productStock > 0 ? `Còn ${productStock}` : 'Hết hàng'}
              </span>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddToWishlist}
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>

                {productStock > 0 && (
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary"
                  >
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    Thêm vào giỏ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;