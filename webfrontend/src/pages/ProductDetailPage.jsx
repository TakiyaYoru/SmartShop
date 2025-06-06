// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useProduct } from '../hooks/useProducts';
import { formatPrice, getImageUrl, calculateDiscountPercentage } from '../lib/utils';
import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - SmartShop`;
    }
    return () => {
      document.title = 'SmartShop';
    };
  }, [product]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductDetailSkeleton />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy sản phẩm
            </h2>
            <p className="text-gray-600 mb-6">
              Sản phẩm có thể đã bị xóa hoặc không tồn tại.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const {
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

  const discount = originalPrice && originalPrice > price 
    ? calculateDiscountPercentage(originalPrice, price) 
    : 0;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (stock === 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }
    if (quantity > stock) {
      toast.error('Số lượng vượt quá hàng tồn kho!');
      return;
    }
    // TODO: Implement add to cart functionality
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    if (stock === 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }
    if (quantity > stock) {
      toast.error('Số lượng vượt quá hàng tồn kho!');
      return;
    }
    // TODO: Implement buy now functionality
    navigate('/checkout');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Đã sao chép link sản phẩm!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Không thể chia sẻ sản phẩm!');
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích!' : 'Đã thêm vào yêu thích!');
  };

  const renderImageGallery = () => (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
        <img
          src={getImageUrl(images[selectedImageIndex] || '/placeholder-product.jpg')}
          alt={name}
          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
          onClick={() => setShowImageModal(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isFeatured && (
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold rounded-lg shadow-lg">
              ⭐ Nổi bật
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-lg shadow-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedImageIndex 
                    ? 'bg-white w-4' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImageIndex
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`${name} - view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderProductInfo = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>{category?.name || 'Chưa phân loại'}</span>
          <span>•</span>
          <span className="font-medium text-blue-600">{brand?.name || 'Không xác định'}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(price)}
        </span>
        {originalPrice && originalPrice > price && (
          <span className="text-lg text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {stock > 0 ? (
          <>
            <CheckIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Còn {stock} sản phẩm
            </span>
          </>
        ) : (
          <>
            <XMarkIcon className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-600">
              Hết hàng
            </span>
          </>
        )}
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Số lượng:</span>
        <div className="flex items-center">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-l-lg border border-r-0 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MinusIcon className="w-4 h-4 text-gray-600" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 1 && val <= stock) setQuantity(val);
            }}
            className="w-16 h-10 border-y border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= stock}
            className="w-10 h-10 rounded-r-lg border border-l-0 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="flex-1 btn btn-primary"
        >
          <ShoppingCartIcon className="w-5 h-5 mr-2" />
          Thêm vào giỏ
        </button>
        <button
          onClick={handleBuyNow}
          disabled={stock === 0}
          className="flex-1 btn btn-secondary"
        >
          Mua ngay
        </button>
        <button
          onClick={handleWishlist}
          className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-colors ${
            isWishlisted
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isWishlisted ? (
            <HeartSolidIcon className="w-6 h-6" />
          ) : (
            <HeartIcon className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={handleShare}
          className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >
          <ShareIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="space-y-6">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setSelectedTab('description')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              selectedTab === 'description'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mô tả
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        <div className="prose prose-sm max-w-none">
          {description || 'Chưa có mô tả cho sản phẩm này.'}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-gray-900">
            Trang chủ
          </button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-gray-900">
            Sản phẩm
          </button>
          <span>/</span>
          <span className="text-gray-900">{name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>{renderImageGallery()}</div>
          <div>{renderProductInfo()}</div>
        </div>

        {/* Tabs */}
        <div>{renderTabs()}</div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <img
              src={getImageUrl(images[selectedImageIndex])}
              alt={name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

const ProductDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Skeleton */}
      <div>
        <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
        <div className="grid grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="flex gap-4">
          <div className="h-12 bg-gray-200 rounded flex-1" />
          <div className="h-12 bg-gray-200 rounded flex-1" />
          <div className="h-12 w-12 bg-gray-200 rounded" />
          <div className="h-12 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailPage;