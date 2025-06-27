// webfrontend/src/pages/CartPage.jsx - FINAL CLEAN VERSION
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_CART } from '../graphql/cart';
import { 
  ShoppingCartIcon, 
  ArrowLeftIcon,
  SparklesIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const CartPage = () => {
  const cartData = useCart();
  const authData = useAuth();
  
  // Intelligent data extraction
  const possibleItems = [
    cartData?.items,
    cartData?.cart?.items, 
    cartData?.getCart?.items,
    cartData?.data?.items
  ];
  
  // Find valid items array
  let items = [];
  let totalItems = 0;
  let subtotal = 0;
  let isEmpty = true;

  for (const possibleItem of possibleItems) {
    if (Array.isArray(possibleItem)) {
      items = possibleItem;
      break;
    }
  }

  // Calculate from found items
  if (Array.isArray(items) && items.length > 0) {
    isEmpty = false;
    totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    subtotal = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  }

  // Fallback: use direct query if context has no data
  const { data: directCartData } = useQuery(GET_CART, {
    skip: !authData.isAuthenticated,
    errorPolicy: 'all'
  });

  if (isEmpty && directCartData?.getCart?.items) {
    items = directCartData.getCart.items;
    totalItems = directCartData.getCart.totalItems || items.length;
    subtotal = directCartData.getCart.subtotal || 0;
    isEmpty = items.length === 0;
  }

  const isLoading = cartData?.loading || cartData?.isLoading || false;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };

  const getProductImage = (product) => {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      // Hiển thị hình đầu tiên
      const firstImage = product.images[0];
      return `http://localhost:4000${firstImage}`;
    }
    return '/placeholder-product.jpg';
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    if (cartData?.updateCartItem) {
      await cartData.updateCartItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      if (cartData?.removeFromCart) {
        await cartData.removeFromCart(productId);
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm(`Bạn có chắc muốn xóa toàn bộ ${totalItems} sản phẩm khỏi giỏ hàng?`)) {
      if (cartData?.clearCart) {
        await cartData.clearCart();
      }
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/products"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Tiếp tục mua sắm
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingCartIcon className="w-8 h-8" />
                Giỏ hàng
                {!isEmpty && totalItems > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-lg font-semibold px-3 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </h1>
            </div>

            {/* Clear Cart Button */}
            {!isEmpty && (
              <button
                onClick={handleClearCart}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <TrashIcon className="w-4 h-4" />
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && items.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải giỏ hàng...</p>
              </div>
            </div>
          )}

          {/* Empty Cart */}
          {!isLoading && isEmpty && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <ShoppingCartIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Giỏ hàng của bạn đang trống
                </h2>
                <p className="text-gray-600 mb-8">
                  Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm chúng vào giỏ hàng!
                </p>
                
                <div className="space-y-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Khám phá sản phẩm
                  </Link>
                  
                  <div className="flex justify-center gap-4 text-sm">
                    <Link 
                      to="/products?featured=true" 
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Sản phẩm nổi bật
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link 
                      to="/products?sort=PRICE_ASC" 
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Giá tốt nhất
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link 
                      to="/products?sort=CREATED_DESC" 
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Hàng mới về
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cart Content */}
          {!isEmpty && items.length > 0 && (
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Cart Header */}
                  <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Sản phẩm trong giỏ ({items.length} sản phẩm)
                      </h2>
                      <div className="text-sm text-gray-500">
                        Tạm tính: <span className="font-semibold text-gray-900">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => {
                      const product = item.product || {};
                      const productImage = getProductImage(product);

                      return (
                        <div key={item._id} className="p-6">
                          <div className="flex items-center space-x-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <Link to={`/products/${product._id}`}>
                                <img
                                  src={productImage}
                                  alt={product.name || item.productName}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-product.jpg';
                                  }}
                                />
                              </Link>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <Link 
                                to={`/products/${product._id}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                  {product.name || item.productName || 'Tên sản phẩm'}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">
                                {product.category?.name || 'Danh mục'} • {product.brand?.name || 'Thương hiệu'}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                SKU: {product.sku || 'N/A'}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <p className="text-lg font-bold text-blue-600">
                                  {formatPrice(item.unitPrice)}
                                </p>
                                {product.originalPrice && product.originalPrice > item.unitPrice && (
                                  <p className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-center space-y-2">
                              <span className="text-sm text-gray-600 font-medium">Số lượng</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                                  disabled={isLoading || item.quantity <= 1}
                                  className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                
                                <span className="w-12 text-center text-base font-semibold bg-gray-50 py-1 rounded">
                                  {item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                                  disabled={isLoading || item.quantity >= (product.stock || 999)}
                                  className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500">
                                Còn lại: {product.stock || 'N/A'}
                              </p>
                            </div>

                            {/* Total Price */}
                            <div className="text-right">
                              <p className="text-sm text-gray-600 mb-1">Thành tiền</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatPrice(item.totalPrice || (item.quantity * item.unitPrice))}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(product._id)}
                              disabled={isLoading}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Xóa khỏi giỏ hàng"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Stock Warning */}
                          {item.quantity >= (product.stock || 999) && (
                            <div className="mt-3 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                              ⚠️ Đã đạt giới hạn tồn kho ({product.stock || 'N/A'} sản phẩm)
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Cart Footer */}
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        💡 <strong>Mẹo:</strong> Miễn phí vận chuyển cho đơn hàng từ 500.000₫
                      </div>
                      {subtotal < 500000 && (
                        <div className="text-sm text-amber-600 font-medium">
                          Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí ship!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended Products */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Có thể bạn cũng thích
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-gray-500 text-center py-8">
                      Tính năng gợi ý sản phẩm sẽ được phát triển trong tương lai! 🎯
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <div className="sticky top-8">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Tóm tắt đơn hàng
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Tạm tính ({totalItems} sản phẩm)
                        </span>
                        <span className="font-medium">
                          {formatPrice(subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí vận chuyển</span>
                        <span className="font-medium text-green-600">
                          {subtotal >= 500000 ? 'Miễn phí' : formatPrice(30000)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">VAT (10%)</span>
                        <span className="font-medium">
                          {formatPrice(subtotal * 0.1)}
                        </span>
                      </div>

                      <hr className="my-4" />

                      <div className="flex justify-between text-lg font-semibold">
                        <span>Tổng cộng</span>
                        <span className="text-blue-600">
                          {formatPrice(subtotal + (subtotal >= 500000 ? 0 : 30000) + subtotal * 0.1)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Link
                        to="/checkout"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        Tiến hành thanh toán
                      </Link>
                      
                      <Link
                        to="/products"
                        className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-center hover:bg-gray-300 transition-colors block"
                      >
                        Tiếp tục mua sắm
                      </Link>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                      🔒 Thông tin thanh toán được bảo mật
                    </div>
                  </div>

                  {/* Trust Signals */}
                  <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Cam kết của chúng tôi</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Bảo hành chính hãng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Đổi trả miễn phí 7 ngày</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Hỗ trợ kỹ thuật 24/7</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Thanh toán an toàn</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Cần hỗ trợ? 
                      <a 
                        href="tel:1900xxxx" 
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        Gọi 1900.xxxx
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CartPage;