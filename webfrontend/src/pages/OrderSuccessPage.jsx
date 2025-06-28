// webfrontend/src/pages/OrderSuccessPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { 
  CheckCircleIcon,
  TruckIcon,
  PhoneIcon,
  ClockIcon,
  HomeIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { GET_MY_ORDER } from '../graphql/orders';
import { useCart } from '../contexts/CartContext';

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  // GraphQL query
  const { data, loading, error } = useQuery(GET_MY_ORDER, {
    variables: { orderNumber },
    errorPolicy: 'all',
    skip: !orderNumber
  });

  const order = data?.getMyOrder;

  // Refresh cart when component mounts
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Redirect if no order number
  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
    }
  }, [orderNumber, navigate]);

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

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Có lỗi xảy ra
              </h2>
              <p className="text-gray-600 mb-6">
                {error ? error.message : 'Không tìm thấy thông tin đơn hàng.'}
              </p>
              <Link
                to="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Về trang chủ
              </Link>
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Success header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Đặt hàng thành công!
              </h1>
              
              <p className="text-xl text-gray-600 mb-4">
                Cảm ơn bạn đã đặt hàng tại SmartShop
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                <p className="text-blue-800 font-semibold">
                  Mã đơn hàng: <span className="text-blue-900">#{order.orderNumber}</span>
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Đặt lúc: {formatDate(order.orderDate)}
                </p>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Thông tin đơn hàng
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <PhoneIcon className="w-5 h-5 mr-2 text-gray-600" />
                      Thông tin nhận hàng
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Họ tên:</span> {order.customerInfo.fullName}</p>
                      <p><span className="font-medium">Điện thoại:</span> {order.customerInfo.phone}</p>
                      <p><span className="font-medium">Địa chỉ:</span> {order.customerInfo.address}</p>
                      {order.customerInfo.notes && (
                        <p><span className="font-medium">Ghi chú:</span> {order.customerInfo.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <TruckIcon className="w-5 h-5 mr-2 text-gray-600" />
                      Thông tin giao hàng
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Phương thức thanh toán:</span> {' '}
                        {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                      </p>
                      <p><span className="font-medium">Tổng tiền:</span> {formatPrice(order.totalAmount)}</p>
                      <p><span className="font-medium">Trạng thái:</span> Đang chờ xác nhận</p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <ShoppingBagIcon className="w-5 h-5 mr-2 text-gray-600" />
                    Sản phẩm đã đặt ({order.items?.length || 0} sản phẩm)
                  </h3>
                  
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.productSnapshot?.images?.[0] || item.product?.images?.[0] || '/placeholder-image.jpg'}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="w-6 h-6 mr-2 text-blue-600" />
                Các bước tiếp theo
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Xác nhận đơn hàng</p>
                    <p className="text-sm text-gray-600">
                      Chúng tôi sẽ xác nhận đơn hàng và liên hệ với bạn trong vòng 30 phút.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Chuẩn bị hàng</p>
                    <p className="text-sm text-gray-600">
                      Đơn hàng sẽ được đóng gói cẩn thận và chuẩn bị giao hàng.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Giao hàng</p>
                    <p className="text-sm text-gray-600">
                      Đơn hàng sẽ được giao đến địa chỉ của bạn trong 1-3 ngày làm việc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                📞 Cần hỗ trợ?
              </h2>
              <p className="text-gray-700 mb-4">
                Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, hãy liên hệ với chúng tôi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Hotline: 1900.xxxx</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span>Email: support@smartshop.vn</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💬</span>
                  <span>Chat: 8:00 - 22:00 hàng ngày</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/orders/${order.orderNumber}`}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center flex items-center justify-center"
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                Xem chi tiết đơn hàng
              </Link>
              
              <Link
                to="/orders"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
              >
                Xem tất cả đơn hàng
              </Link>
              
              <Link
                to="/products"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center flex items-center justify-center"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Tiếp tục mua sắm
              </Link>
            </div>

            {/* Thank you message */}
            <div className="text-center mt-8 py-6">
              <p className="text-gray-600 text-lg">
                🙏 Cảm ơn bạn đã tin tương và lựa chọn SmartShop!
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default OrderSuccessPage;