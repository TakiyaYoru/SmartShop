// webfrontend/src/pages/OrderDetailPage.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { 
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PrinterIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { 
  GET_MY_ORDER, 
  getOrderStatusInfo, 
  getPaymentStatusInfo,
  getPaymentMethodLabel 
} from '../graphql/orders';

const OrderDetailPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  // GraphQL query
  const { data, loading, error, refetch } = useQuery(GET_MY_ORDER, {
    variables: { orderNumber },
    errorPolicy: 'all'
  });

  const order = data?.getMyOrder;

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const StatusBadge = ({ status, type = 'order', className = '' }) => {
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[statusInfo.color]} ${className}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Order timeline
  const OrderTimeline = ({ order }) => {
    const timelineItems = [
      {
        status: 'pending',
        title: 'Đơn hàng được tạo',
        description: 'Đơn hàng đã được gửi và đang chờ xác nhận',
        date: order.orderDate,
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Đã xác nhận',
        description: 'Đơn hàng đã được xác nhận và chuẩn bị',
        date: order.confirmedAt,
        completed: ['confirmed', 'processing', 'shipping', 'delivered'].includes(order.status)
      },
      {
        status: 'processing',
        title: 'Đang xử lý',
        description: 'Đơn hàng đang được đóng gói',
        date: order.processedAt,
        completed: ['processing', 'shipping', 'delivered'].includes(order.status)
      },
      {
        status: 'shipping',
        title: 'Đang giao hàng',
        description: 'Đơn hàng đang trên đường giao đến bạn',
        date: order.shippedAt,
        completed: ['shipping', 'delivered'].includes(order.status)
      },
      {
        status: 'delivered',
        title: 'Đã giao hàng',
        description: 'Đơn hàng đã được giao thành công',
        date: order.deliveredAt,
        completed: order.status === 'delivered'
      }
    ];

    // Filter out cancelled status
    if (order.status === 'cancelled') {
      return (
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center">
            <XCircleIcon className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="font-semibold text-red-900">Đơn hàng đã bị hủy</h3>
              <p className="text-sm text-red-700 mt-1">
                Hủy lúc: {formatDate(order.cancelledAt)}
              </p>
              {order.adminNotes && (
                <p className="text-sm text-red-700 mt-2">
                  Lý do: {order.adminNotes}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flow-root">
        <ul className="-mb-8">
          {timelineItems.map((item, itemIdx) => (
            <li key={item.status}>
              <div className="relative pb-8">
                {itemIdx !== timelineItems.length - 1 ? (
                  <span
                    className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                      item.completed ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        item.completed
                          ? 'bg-blue-600'
                          : order.status === item.status
                          ? 'bg-yellow-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : order.status === item.status ? (
                        <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : (
                        <span className="h-2.5 w-2.5 bg-gray-400 rounded-full" />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className={`text-sm font-medium ${
                        item.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {item.title}
                      </p>
                      <p className={`text-sm ${
                        item.completed ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={item.date}>
                        {formatDate(item.date)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <LoadingSkeleton className="h-96" />
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error ? 'Có lỗi xảy ra' : 'Không tìm thấy đơn hàng'}
              </h2>
              <p className="text-gray-600 mb-4">
                {error ? error.message : 'Đơn hàng này không tồn tại hoặc không thuộc về bạn.'}
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Quay lại
                </button>
                {error && (
                  <button
                    onClick={() => refetch()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Thử lại
                  </button>
                )}
              </div>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Quay lại
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Đơn hàng #{order.orderNumber}
                    </h1>
                    <p className="text-gray-600">
                      Đặt lúc: {formatDate(order.orderDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={order.status} />
                  <StatusBadge status={order.paymentStatus} type="payment" />
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    In hóa đơn
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Order timeline */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Trạng thái đơn hàng
                  </h2>
                  <OrderTimeline order={order} />
                </div>

                {/* Order items */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      Sản phẩm đã đặt
                    </h2>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {order.items?.map((item) => (
                      <div key={item._id} className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={item.productSnapshot?.images?.[0] || item.product?.images?.[0] || '/placeholder-image.jpg'}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {item.productName}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              SKU: {item.productSku}
                            </p>
                            {item.productSnapshot?.brand && (
                              <p className="text-gray-600">
                                Thương hiệu: {item.productSnapshot.brand}
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">
                              {formatPrice(item.unitPrice)} × {item.quantity}
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              {formatPrice(item.totalPrice)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order total */}
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Tổng cộng:
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Customer info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Thông tin khách hàng
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customerInfo.fullName}
                        </p>
                        <p className="text-gray-600">
                          {order.customerInfo.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Địa chỉ giao hàng</p>
                        <p className="text-gray-600">
                          {order.customerInfo.address}
                        </p>
                      </div>
                    </div>

                    {order.customerInfo.notes && (
                      <div className="flex items-start space-x-3">
                        <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Ghi chú</p>
                          <p className="text-gray-600">
                            {order.customerInfo.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Thông tin thanh toán
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-medium text-gray-900">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium">
                        {formatPrice(order.subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">VAT (10%):</span>
                      <span className="font-medium">
                        {formatPrice(order.totalAmount - order.subtotal)}
                      </span>
                    </div>

                    <hr className="my-4" />

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Hành động
                  </h3>
                  
                  <div className="space-y-3">
                    {order.status === 'delivered' && (
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Mua lại
                      </button>
                    )}
                    
                    {['pending', 'confirmed'].includes(order.status) && (
                      <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        Hủy đơn hàng
                      </button>
                    )}

                    <Link
                      to="/orders"
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                    >
                      Xem tất cả đơn hàng
                    </Link>

                    <Link
                      to="/contact"
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
                    >
                      Liên hệ hỗ trợ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default OrderDetailPage;