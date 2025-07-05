// File: webfrontend/src/pages/ProductDetailPage.jsx - Add Reviews section
// UPDATE: Add reviews imports and integrate review components

import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  ArrowLeftIcon,
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

import Layout from '../components/common/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import AddToCartButton from '../components/cart/AddToCartButton';
import { SmartImage } from '../utils/imageHelper';
import { GET_PRODUCT } from '../graphql/products';

// NEW: Import Review Components
import ReviewList from '../components/reviews/ReviewList';
import CreateReviewForm from '../components/reviews/CreateReviewForm';
import { renderStarRating } from '../utils/reviewHelper';

const ProductDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'reviews', 'write-review'

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
    errorPolicy: 'all'
  });

  // NEW: Auto-switch to review form if coming from OrdersPage
  React.useEffect(() => {
    if (location.state?.openReviewForm) {
      setActiveTab('write-review');
    }
  }, [location.state]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton type="product-detail" />
        </div>
      </Layout>
    );
  }

  if (error || !data?.product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tồn tại</h1>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const product = data.product;
  const hasImages = product.images && product.images.length > 0;
  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-700">Sản phẩm</Link>
          <span>/</span>
          <Link to={`/categories/${product.category._id}`} className="hover:text-gray-700">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {hasImages ? (
                <SmartImage
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  fallback="/placeholder-product.jpg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Không có hình ảnh</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {hasImages && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-blue-500' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <SmartImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      fallback="/placeholder-product.jpg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Link 
                  to={`/brands/${product.brand._id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {product.brand.name}
                </Link>
                {product.isFeatured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <StarIcon className="h-3 w-3 mr-1" />
                    Nổi bật
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* NEW: Rating Display */}
              {product.totalReviews > 0 && (
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStarRating(product.averageRating, 'md')}
                    <span className="text-lg font-medium text-gray-900 ml-2">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    ({product.totalReviews} đánh giá)
                  </button>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>SKU: {product.sku}</span>
                <span>|</span>
                <span className={`${isOutOfStock ? 'text-red-600' : 'text-green-600'} font-medium`}>
                  {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm`}
                </span>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
              {!isOutOfStock && (
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-16 px-2 py-2 text-center border-0 focus:ring-0"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <AddToCartButton
                  product={product}
                  quantity={quantity}
                  disabled={isOutOfStock}
                  className="flex-1"
                />
                <button className="p-3 text-gray-400 hover:text-red-500 border border-gray-300 rounded-lg transition-colors">
                  <HeartIcon className="h-5 w-5" />
                </button>
                <button className="p-3 text-gray-400 hover:text-blue-500 border border-gray-300 rounded-lg transition-colors">
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <TruckIcon className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Miễn phí vận chuyển</p>
                  <p className="text-sm text-green-700">Đơn hàng từ 500k</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Bảo hành chính hãng</p>
                  <p className="text-sm text-blue-700">12 tháng</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Hỗ trợ 24/7</p>
                  <p className="text-sm text-purple-700">Tư vấn miễn phí</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Tabs Section for Description and Reviews */}
        <div className="border-t border-gray-200">
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mô tả sản phẩm
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đánh giá ({product.totalReviews || 0})
            </button>
            
            <button
              onClick={() => setActiveTab('write-review')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'write-review'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Viết đánh giá
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <div className="prose prose-gray max-w-none">
                  {product.description ? (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {product.description}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>Chưa có mô tả cho sản phẩm này.</p>
                    </div>
                  )}
                </div>

                {/* Product Specifications */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sản phẩm</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thương hiệu:</span>
                        <span className="font-medium">{product.brand?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Danh mục:</span>
                        <span className="font-medium">{product.category?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SKU:</span>
                        <span className="font-medium">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tình trạng:</span>
                        <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                          {isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chính sách</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <span>•</span>
                        <span>Bảo hành chính hãng 12 tháng</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span>•</span>
                        <span>Miễn phí vận chuyển đơn hàng từ 500.000đ</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span>•</span>
                        <span>Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span>•</span>
                        <span>Hỗ trợ kỹ thuật 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-6xl">
                <ReviewList 
                  productId={product._id} 
                  productReviewStats={product.reviewStats}
                  isAdmin={false}
                />
              </div>
            )}

            {activeTab === 'write-review' && (
              <div className="max-w-4xl">
                <CreateReviewForm
                  productId={product._id}
                  product={product}
                  onReviewCreated={() => {
                    setActiveTab('reviews');
                    // Optionally refetch product data to update review stats
                  }}
                  onCancel={() => setActiveTab('reviews')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section (Optional) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          <div className="text-center py-12 text-gray-500">
            <p>Chức năng sản phẩm liên quan sẽ được cập nhật sau.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;