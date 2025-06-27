// webfrontend/src/components/products/ProductCard.jsx - CẬP NHẬT với AddToCartButton
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
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
import AddToCartButton from '../cart/AddToCartButton'; // ← THÊM IMPORT

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

  const mainImage = images.length > 0 
    ? getImageUrl(images[0]) 
    : '/placeholder-product.jpg';

  const secondaryImage = images.length > 1 
    ? getImageUrl(images[1]) 
    : null;

  // Stock status với màu sắc và icon
  const getStockStatus = () => {
    if (productStock === 0) {
      return { 
        text: 'Hết hàng', 
        color: 'bg-red-100 text-red-800',
        icon: '❌'
      };
    } else if (productStock <= 5) {
      return { 
        text: `Chỉ còn ${productStock}`, 
        color: 'bg-orange-100 text-orange-800',
        icon: '⚠️'
      };
    } else if (productStock <= 20) {
      return { 
        text: 'Sắp hết', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⏰'
      };
    } else {
      return { 
        text: 'Còn hàng', 
        color: 'bg-green-100 text-green-800',
        icon: '✅'
      };
    }
  };

  const stockStatus = getStockStatus();

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${className}`}>
        <div className="flex p-4 gap-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <Link to={`/products/${_id}`}>
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageError ? '/placeholder-product.jpg' : mainImage}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    -{discount}%
                  </div>
                )}
                
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute top-1 right-1 bg-yellow-500 text-white p-1 rounded">
                    <SparklesIcon className="w-3 h-3" />
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div className="flex-1">
                <Link to={`/products/${_id}`}>
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                    {name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{categoryName}</span>
                  <span>•</span>
                  <span>{brandName}</span>
                </div>
                
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {description}
                </p>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col items-end justify-between ml-4">
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(productPrice)}
                    </span>
                    {originalPrice && originalPrice > productPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${stockStatus.color}`}>
                    <span className="mr-1">{stockStatus.icon}</span>
                    {stockStatus.text}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={handleWishlistToggle}
                    className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="w-4 h-4 text-red-500" />
                    ) : (
                      <HeartIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  {/* SỬ DỤNG AddToCartButton */}
                  <AddToCartButton 
                    product={product}
                    size="sm"
                    variant="primary"
                    disabled={productStock === 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view layout (default)
  return (
    <div 
      className={`group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/products/${_id}`}>
          <img
            src={imageError ? '/placeholder-product.jpg' : mainImage}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
            onError={() => setImageError(true)}
          />
          
          {/* Secondary Image for Hover Effect */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${name} - alternative view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              -{discount}%
            </div>
          )}
          
          {/* Featured Badge */}
          {isFeatured && (
            <div className="bg-yellow-500 text-white p-2 rounded-full shadow-md">
              <SparklesIcon className="w-4 h-4" />
            </div>
          )}
          
          {/* Free Shipping Badge */}
          {productPrice >= 500000 && (
            <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md flex items-center gap-1">
              <TruckIcon className="w-3 h-3" />
              Free Ship
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            <button
              onClick={handleWishlistToggle}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md group"
            >
              {isWishlisted ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
              )}
            </button>
            
            <Link
              to={`/products/${_id}`}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md group"
            >
              <EyeIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
            </Link>
          </div>
        )}

        {/* Rating Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <StarSolidIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700">4.5</span>
          <span className="text-xs text-gray-500">(128)</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-1 rounded-full">{categoryName}</span>
          <span className="font-medium">{brandName}</span>
        </div>

        {/* Product Name */}
        <Link to={`/products/${_id}`}>
          <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2 min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 min-h-[2rem]">
          {description}
        </p>

        {/* Bottom Section */}
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(productPrice)}
              </span>
              {originalPrice && originalPrice > productPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarSolidIcon
                  key={i}
                  className={`w-3 h-3 ${
                    i < 4 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${stockStatus.color}`}>
            <span className="mr-1">{stockStatus.icon}</span>
            {stockStatus.text}
          </div>

          {/* Add to Cart Button - SỬ DỤNG AddToCartButton */}
          {showQuickActions && (
            <AddToCartButton 
              product={product}
              size="md"
              variant="primary"
              disabled={productStock === 0}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;