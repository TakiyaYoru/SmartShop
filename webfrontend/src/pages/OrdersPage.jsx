// webfrontend/src/pages/OrdersPage.jsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  EyeIcon, 
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { 
  GET_MY_ORDERS, 
  getOrderStatusInfo, 
  getPaymentStatusInfo,
  getPaymentMethodLabel,
  ORDER_BY_OPTIONS
} from '../graphql/orders';

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState(ORDER_BY_OPTIONS.ORDER_DATE_DESC);
  const itemsPerPage = 10;

  // GraphQL query
  const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS, {
    variables: {
      first: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      orderBy: orderBy
    },
    errorPolicy: 'all'
  });

  const orders = data?.getMyOrders?.nodes || [];
  const totalCount = data?.getMyOrders?.totalCount || 0;
  const hasNextPage = data?.getMyOrders?.hasNextPage || false;
  const hasPreviousPage = data?.getMyOrders?.hasPreviousPage || false;

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const StatusBadge = ({ status, type = 'order' }) => {
    const statusInfo = type === 'order' ? getOrderStatusInfo(status) : getPaymentStatusInfo(status);
    
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses[statusInfo.color]}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setOrderBy(e.target.value);
    setCurrentPage(1);
  };

  // Pagination component
  const Pagination = () => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> đến{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> trong tổng số{' '}
              <span className="font-medium">{totalCount}</span> đơn hàng
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                ‹
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage - 2 + i;
                if (page < 1 || page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === currentPage
                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                ›
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Order card component
  const OrderCard = ({ order }) => {
    const statusInfo = getOrderStatusInfo(order.status);
    const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Đơn hàng #{order.orderNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  Đặt lúc: {formatDate(order.orderDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} type="payment" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products */}
            <div className="lg:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3">Sản phẩm đã đặt</h4>
              <div className="space-y-3">
                {order.items?.slice(0, 2).map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.productSnapshot?.images?.[0] || item.product?.images?.[0] || '/placeholder-image.jpg'}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.productName}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>Số lượng: {item.quantity}</span>
                        <span className="mx-2">•</span>
                        <span>{formatPrice(item.unitPrice)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {order.items?.length > 2 && (
                  <p className="text-sm text-gray-600 text-center py-2">
                    Và {order.items.length - 2} sản phẩm khác...
                  </p>
                )}
              </div>
            </div>

            {/* Order info */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-semibold text-lg text-blue-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thanh toán:</span>
                    <span className="font-medium">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Giao hàng</h4>
                <div className="text-sm text-gray-600">
                  <p>{order.customerInfo.fullName}</p>
                  <p>{order.customerInfo.phone}</p>
                  <p className="truncate">{order.customerInfo.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {order.status === 'delivered' && (
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  <span>Giao hàng thành công</span>
                </div>
              )}
              {order.status === 'shipping' && (
                <div className="flex items-center text-blue-600">
                  <TruckIcon className="w-4 h-4 mr-1" />
                  <span>Đang giao hàng</span>
                </div>
              )}
              {order.status === 'cancelled' && (
                <div className="flex items-center text-red-600">
                  <XCircleIcon className="w-4 h-4 mr-1" />
                  <span>Đã hủy</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/orders/${order.orderNumber}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Link>
              
              {order.status === 'delivered' && (
                <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Mua lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <button
                onClick={() => refetch()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <ShoppingBagIcon className="w-8 h-8 mr-3 text-blue-600" />
                    Đơn hàng của tôi
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Theo dõi và quản lý đơn hàng của bạn
                  </p>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Sắp xếp:
                  </label>
                  <select
                    value={orderBy}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={ORDER_BY_OPTIONS.ORDER_DATE_DESC}>Mới nhất</option>
                    <option value={ORDER_BY_OPTIONS.ORDER_DATE_ASC}>Cũ nhất</option>
                    <option value={ORDER_BY_OPTIONS.TOTAL_AMOUNT_DESC}>Giá cao nhất</option>
                    <option value={ORDER_BY_OPTIONS.TOTAL_AMOUNT_ASC}>Giá thấp nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <LoadingSkeleton key={i} className="h-64" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
                    <ShoppingBagIcon className="w-16 h-16 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Chưa có đơn hàng nào
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời và đặt hàng ngay!
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Khám phá sản phẩm
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Orders list */}
                <div className="space-y-6 mb-8">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination />
              </>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default OrdersPage;