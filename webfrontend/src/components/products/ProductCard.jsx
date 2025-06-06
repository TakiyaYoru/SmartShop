// src/components/products/ProductCard.jsx - Modern & Beautiful Design
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon,
  StarIcon,
  SparklesIcon,
  TagIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon 
} from '@heroicons/react/24/solid';
import { formatPrice, getImageUrl, calculateDiscountPercentage } from '../../lib/utils';

const ProductCard = ({ 
  product, 
  viewMode = 'grid',
  showQuickActions = true,
  className = '' 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
  const hoverImage = images.length > 1 ? getImageUrl(images[1]) : mainImage;

  // Mock rating - trong thực tế sẽ lấy từ API
  const rating = 4.2;
  const reviewCount = Math.floor(Math.random() * 200) + 10;

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to cart:', product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Quick view:', product);
  };

  // Get stock status
  const getStockStatus = () => {
    if (productStock === 0) return { text: 'Hết hàng', color: 'bg-red-100 text-red-700', icon: '❌' };
    if (productStock <= 5) return { text: `Chỉ còn ${productStock}`, color: 'bg-orange-100 text-orange-700', icon: '⚠️' };
    if (productStock <= 20) return { text: 'Còn ít', color: 'bg-yellow-100 text-yellow-700', icon: '⏰' };
    return { text: 'Còn hàng', color: 'bg-green-100 text-green-700', icon: '✅' };
  };

  const stockStatus = getStockStatus();

  // Grid view layout
  if (viewMode === 'grid') {
    return (
      <div className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}>
        {/* Image Container */}
        <Link 
          to={`/products/${_id}`} 
          className="block relative overflow-hidden bg-gray-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-square relative">
            {/* Main Image */}
            <img
              src={imageError ? '/placeholder-product.jpg' : mainImage}
              alt={name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                isHovered && images.length > 1 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            
            {/* Hover Image */}
            {images.length > 1 && (
              <img
                src={hoverImage}
                alt={`${name} - view 2`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                loading="lazy"
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isFeatured && (
                <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-lg shadow-lg">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  HOT
                </span>
              )}
              {discount > 0 && (
                <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-lg">
                  <TagIcon className="w-3 h-3 mr-1" />
                  -{discount}%
                </span>
              )}
              {productStock === 0 && (
                <span className="px-2 py-1 bg-gray-900/80 text-white text-xs font-semibold rounded-lg backdrop-blur-sm">
                  Hết hàng
                </span>
              )}
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={handleAddToWishlist}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
                    isWishlisted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                  title={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleQuickView}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 hover:scale-110"
                  title="Xem nhanh"
                >
                  <EyeIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}

            {/* Free Shipping Badge */}
            {productPrice >= 500000 && (
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg shadow-lg">
                  <TruckIcon className="w-3 h-3 mr-1" />
                  Miễn phí vận chuyển
                </span>
              </div>
            )}

            {/* Quick Add to Cart (Bottom overlay) */}
            {showQuickActions && productStock > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center"
                >
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Thêm vào giỏ
                </button>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Brand */}
          <div className="flex items-center gap-2 mb-2">
            <Link 
              to={`/categories/${category?._id}`}
              className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
            >
              {categoryName}
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              to={`/brands/${brand?._id}`}
              className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
            >
              {brandName}
            </Link>
          </div>

          {/* Product Name */}
          <Link to={`/products/${_id}`}>
            <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <StarSolidIcon
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(rating)
                      ? 'text-yellow-400'
                      : index < rating
                      ? 'text-gradient-to-r from-yellow-400 to-gray-300'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(productPrice)}
            </span>
            {originalPrice && originalPrice > productPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${stockStatus.color}`}>
            <span className="mr-1">{stockStatus.icon}</span>
            {stockStatus.text}
          </div>
        </div>
      </div>
    );
  }

  // List view layout
  return (
    <div className={`group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex">
        {/* Image */}
        <Link 
          to={`/products/${_id}`}
          className="relative w-48 bg-gray-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-square relative">
            <img
              src={imageError ? '/placeholder-product.jpg' : mainImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isFeatured && (
                <span className="inline-flex items-center px-2 py-1 bg-yellow-400 text-white text-xs font-bold rounded-lg">
                  HOT
                </span>
              )}
              {discount > 0 && (
                <span className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                  -{discount}%
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 mb-1">
                <Link 
                  to={`/categories/${category?._id}`}
                  className="text-xs text-gray-600 hover:text-blue-600"
                >
                  {categoryName}
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  to={`/brands/${brand?._id}`}
                  className="text-xs text-gray-600 hover:text-blue-600"
                >
                  {brandName}
                </Link>
              </div>

              {/* Name */}
              <Link to={`/products/${_id}`}>
                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2">
                  {name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <StarSolidIcon
                      key={index}
                      className={`w-4 h-4 ${
                        index < Math.floor(rating)
                          ? 'text-yellow-400'
                          : index < rating
                          ? 'text-gradient-to-r from-yellow-400 to-gray-300'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviewCount})
                </span>
              </div>

              {/* Description */}
              {description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {description}
                </p>
              )}
            </div>

            {/* Actions */}
            {showQuickActions && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToWishlist}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isWishlisted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between mt-4">
            <div>
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(productPrice)}
                </span>
                {originalPrice && originalPrice > productPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium mt-2 ${stockStatus.color}`}>
                <span className="mr-1">{stockStatus.icon}</span>
                {stockStatus.text}
              </div>
            </div>

            {/* Add to Cart */}
            {showQuickActions && productStock > 0 && (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Thêm vào giỏ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;