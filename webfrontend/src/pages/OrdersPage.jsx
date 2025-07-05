// webfrontend/src/pages/OrdersPage.jsx - UPDATED with Review Integration
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ShoppingBagIcon, 
  EyeIcon, 
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CreditCardIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useAuth } from '../contexts/AuthContext';
import { SmartImage } from '../utils/imageHelper';
import { 
  GET_MY_ORDERS, 
  CANCEL_ORDER,
  getOrderStatusInfo, 
  getPaymentStatusInfo,
  getPaymentMethodLabel
} from '../graphql/orders';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState('DATE_DESC');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const itemsPerPage = 10;

  // GraphQL query
  const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS, {
    variables: {
      first: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      orderBy: orderBy
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  // Cancel order mutation
  const [cancelOrderMutation] = useMutation(CANCEL_ORDER, {
    onCompleted: (data) => {
      if (data.cancelOrder) {
        toast.success('Đã hủy đơn hàng thành công!');
        refetch();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể hủy đơn hàng');
    },
    onSettled: () => {
      setCancellingOrder(null);
    }
  });

  const orders = data?.getMyOrders?.nodes || [];
  const totalCount = data?.getMyOrders?.totalCount || 0;

  // Helper functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async (orderNumber) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    
    setCancellingOrder(orderNumber);
    try {
      await cancelOrderMutation({
        variables: { orderNumber, reason: 'Khách hàng yêu cầu hủy' }
      });
    } catch (error) {
      console.error('Cancel order error:', error);
    }
  };

  // NEW: Navigate to review page for specific product
  const handleReviewProduct = (productId, productName) => {
    navigate(`/products/${productId}`, { 
      state: { 
        openReviewForm: true, 
        productName: productName 
      } 
    });
  };

  // Component for individual order item with review option
  const OrderItem = ({ item, order }) => {
    const canReview = order.status === 'delivered' && order.paymentStatus === 'paid';
    
    return (
      <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
        {/* Product Image */}
        <div className="flex-shrink-0 w-16 h-16">
          {item.productSnapshot?.images?.[0] ? (
            <SmartImage
              src={item.productSnapshot.images[0]}
              alt={item.productName}
              className="w-full h-full object-cover rounded-lg"
              fallback="/placeholder-product.jpg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {item.productName}
          </h4>
          <p className="text-sm text-gray-500">SKU: {item.productSku}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">
              Số lượng: {item.quantity}
            </span>
            <div className="text-right">
              <span className="text-sm text-gray-500">
                {formatPrice(item.unitPrice)} x {item.quantity}
              </span>
              <div className="font-medium text-gray-900">
                {formatPrice(item.totalPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Review Button */}
        {canReview && (
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleReviewProduct(item.productId, item.productName)}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <StarIcon className="h-4 w-4" />
              <span>Đánh giá</span>
            </button>
            <Link
              to={`/products/${item.productId}`}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
            >
              <ShoppingBagIcon className="h-4 w-4" />
              <span>Mua lại</span>
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Main order card component
  const OrderCard = ({ order }) => {
    const [showItems, setShowItems] = useState(false);
    const statusInfo = getOrderStatusInfo(order.status);
    const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
    const canCancel = ['pending', 'confirmed'].includes(order.status);
    const isCancelling = cancellingOrder === order.orderNumber;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Order Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  #{order.orderNumber}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(order.totalAmount)}
              </div>
              <p className="text-sm text-gray-500">
                {order.items?.length || 0} sản phẩm
              </p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
              statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
              statusInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              {statusInfo.label}
            </span>
            
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              paymentInfo.color === 'green' ? 'bg-green-100 text-green-800' :
              paymentInfo.color === 'red' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              <CreditCardIcon className="w-4 h-4 mr-1" />
              {paymentInfo.label}
            </span>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">
                Sản phẩm đã đặt
              </h4>
              {order.items.length > 1 && (
                <button
                  onClick={() => setShowItems(!showItems)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showItems ? '↑ Ẩn bớt' : '↓ Xem tất cả'}
                </button>
              )}
            </div>

            {/* Show first item or all if expanded */}
            <div className="space-y-3">
              {(showItems ? order.items : order.items.slice(0, 1)).map((item, index) => (
                <OrderItem key={item._id || index} item={item} order={order} />
              ))}
              
              {!showItems && order.items.length > 1 && (
                <div className="text-center py-3 border border-gray-200 border-dashed rounded-lg">
                  <button
                    onClick={() => setShowItems(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Xem thêm {order.items.length - 1} sản phẩm
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Contact Support */}
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                <span>Liên hệ</span>
              </button>
              
              {/* Cancel button */}
              {canCancel && (
                <button
                  onClick={() => handleCancelOrder(order.orderNumber)}
                  disabled={isCancelling}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isCancelling 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'text-red-700 bg-red-50 hover:bg-red-100'
                  }`}
                >
                  {isCancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      <span>Đang hủy...</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4" />
                      <span>Hủy đơn</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/orders/${order.orderNumber}`}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <EyeIcon className="h-4 w-4" />
                <span>Chi tiết</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LoadingSkeleton type="order-card" count={3} />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-gray-500 mb-4">
                {error.message || 'Không thể tải danh sách đơn hàng'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi tình trạng đơn hàng của bạn
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipping">Đang giao hàng</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>

              {/* Sort */}
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DATE_DESC">Mới nhất</option>
                <option value="DATE_ASC">Cũ nhất</option>
                <option value="TOTAL_DESC">Giá trị cao</option>
                <option value="TOTAL_ASC">Giá trị thấp</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-500 mb-6">
                Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}

          {/* Load More / Pagination can be added here */}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default OrdersPage;