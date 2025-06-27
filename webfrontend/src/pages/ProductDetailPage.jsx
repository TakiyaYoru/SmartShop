// webfrontend/src/pages/ProductDetailPage.jsx - CẬP NHẬT với AddToCartButton
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import AddToCartButton from '../components/cart/AddToCartButton'; // ← THÊM IMPORT
import { useCart } from '../contexts/CartContext'; // ← THÊM IMPORT
import { useProduct } from '../hooks/useProducts';
import { formatPrice, getImageUrl, calculateDiscountPercentage } from '../lib/utils';
import {
  HeartIcon,
  ShoppingCartIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart(); // ← THÊM useCart

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    isFeatured,
    sku,
    createdAt,
    updatedAt
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

  // ← XÓA handleAddToCart cũ và sử dụng AddToCartButton component

  const handleBuyNow = async () => {
    if (stock === 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }
    if (quantity > stock) {
      toast.error('Số lượng vượt quá hàng tồn kho!');
      return;
    }
    
    // Thêm vào giỏ hàng trước rồi chuyển đến checkout
    try {
      await addToCart(product._id, quantity);
      navigate('/checkout');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Trang chủ
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                <button 
                  onClick={() => navigate('/products')}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  Sản phẩm
                </button>
              </div>
            </li>
            {category && (
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {category.name}
                  </span>
                </div>
              </li>
            )}
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-xs">
                  {name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <div className="grid grid-cols-4 gap-6">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-blue-500 ${
                        selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <span className="sr-only">Ảnh {index + 1}</span>
                      <span className="absolute inset-0 rounded-md overflow-hidden">
                        <img
                          src={getImageUrl(image)}
                          alt=""
                          className="w-full h-full object-center object-cover"
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 w-full">
              <div className="relative">
                <img
                  src={getImageUrl(images[selectedImageIndex] || images[0])}
                  alt={name}
                  className="w-full h-full object-center object-cover sm:rounded-lg"
                  onClick={() => setShowImageModal(true)}
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{discount}%
                    </span>
                  )}
                  {isFeatured && (
                    <span className="bg-yellow-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      Nổi bật
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {name}
            </h1>

            {/* Brand & Category */}
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
              {brand && (
                <div className="flex items-center gap-1">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  <span>Thương hiệu: <span className="font-medium">{brand.name}</span></span>
                </div>
              )}
              {category && (
                <div className="flex items-center gap-1">
                  <span>Danh mục: <span className="font-medium">{category.name}</span></span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(price)}
                </p>
                {originalPrice && originalPrice > price && (
                  <p className="text-xl text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </p>
                )}
              </div>
              {discount > 0 && (
                <p className="mt-1 text-sm text-green-600 font-medium">
                  Tiết kiệm {formatPrice(originalPrice - price)} ({discount}%)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-6 flex items-center">
              {stock > 0 ? (
                <>
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600 ml-2">
                    Còn {stock} sản phẩm
                  </span>
                </>
              ) : (
                <>
                  <XMarkIcon className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-600 ml-2">
                    Hết hàng
                  </span>
                </>
              )}
            </div>

            {/* SKU */}
            <div className="mt-3 text-sm text-gray-600">
              SKU: <span className="font-medium">{sku}</span>
            </div>

            {/* Quantity Selector */}
            <div className="mt-8 flex items-center gap-4">
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

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-4">
              {/* SỬ DỤNG AddToCartButton với quantity */}
              <AddToCartButton 
                product={product}
                quantity={quantity}
                size="lg"
                variant="primary"
                disabled={stock === 0}
                className="flex-1"
              />
              
              <button
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-12 h-12 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <span>Bảo hành chính hãng</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <span>Đổi trả trong 7 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mô tả sản phẩm</h3>
              <div className="prose prose-sm text-gray-600">
                <p>{description}</p>
              </div>
            </div>

            {/* Brand Info */}
            {brand && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin thương hiệu</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    {brand.logo && (
                      <img 
                        src={getImageUrl(brand.logo)} 
                        alt={brand.name}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                      {brand.description && (
                        <p className="text-sm text-gray-600 mt-1">{brand.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {brand.country && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3" />
                            <span>{brand.country}</span>
                          </div>
                        )}
                        {brand.foundedYear && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>Thành lập {brand.foundedYear}</span>
                          </div>
                        )}
                        {brand.website && (
                          <div className="flex items-center gap-1">
                            <GlobeAltIcon className="w-3 h-3" />
                            <a 
                              href={brand.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
              <img
                src={getImageUrl(images[selectedImageIndex] || images[0])}
                alt={name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Loading Skeleton Component
const ProductDetailSkeleton = () => (
  <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start animate-pulse">
    <div className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      <div className="aspect-w-1 aspect-h-1 w-full">
        <div className="w-full h-96 bg-gray-200 rounded-lg" />
      </div>
    </div>
    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />
      <div className="h-10 bg-gray-200 rounded w-1/3 mt-6" />
      <div className="h-6 bg-gray-200 rounded w-1/4 mt-4" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-4" />
      <div className="flex gap-4 mt-8">
        <div className="h-10 bg-gray-200 rounded w-20" />
      </div>
      <div className="flex gap-4 mt-6">
        <div className="h-12 bg-gray-200 rounded flex-1" />
        <div className="h-12 bg-gray-200 rounded flex-1" />
        <div className="h-12 w-12 bg-gray-200 rounded" />
        <div className="h-12 w-12 bg-gray-200 rounded" />
      </div>
      <div className="h-40 bg-gray-200 rounded mt-8" />
    </div>
  </div>
);

export default ProductDetailPage;