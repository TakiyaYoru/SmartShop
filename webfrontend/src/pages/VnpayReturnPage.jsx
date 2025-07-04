import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CheckCircleIcon, XCircleIcon, ShoppingBagIcon, HomeIcon } from '@heroicons/react/24/outline';
import Layout from '../components/common/Layout';
import { HANDLE_VNPAY_RETURN } from '../graphql/vnpay';
import { formatVND } from '../graphql/vnpay';

const VnpayReturnPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState(null);

  const [handleVnpayReturn] = useMutation(HANDLE_VNPAY_RETURN, {
    onCompleted: (data) => {
      setPaymentResult(data.handleVnpayReturn);
      setProcessing(false);
    },
    onError: (error) => {
      setError(error.message);
      setProcessing(false);
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vnp_Params = {
      vnp_TxnRef: params.get('orderNumber'),
      vnp_Amount: params.get('amount'),
      vnp_ResponseCode: params.get('responseCode'),
      vnp_TransactionNo: params.get('transactionNo'),
      vnp_BankCode: params.get('bankCode'),
      vnp_PayDate: params.get('payDate'),
      vnp_SecureHash: params.get('vnp_SecureHash') || ''
    };

    if (!vnp_Params.vnp_TxnRef || !vnp_Params.vnp_ResponseCode) {
      setError('Thiếu thông tin thanh toán từ VNPay');
      setProcessing(false);
      return;
    }

    handleVnpayReturn({ variables: vnp_Params });
  }, [location.search, handleVnpayReturn]);

  if (processing) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang xử lý kết quả thanh toán...</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || location.search.includes('error')) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-6">{error || 'Lỗi không xác định'}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Quay về giỏ hàng
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { success, order, paymentInfo, message } = paymentResult || {};
  const isSuccess = success === true;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`px-6 py-8 text-center ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                {isSuccess ? <CheckCircleIcon className="w-10 h-10 text-green-600" /> : <XCircleIcon className="w-10 h-10 text-red-600" />}
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-900' : 'text-red-900'}`}>
                {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
              </h1>
              <p className={`text-lg ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
            </div>
            {order && (
              <div className="px-6 py-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Thông tin đơn hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tổng tiền:</span>
                    <p className="font-medium text-blue-600">{formatVND(order.totalAmount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Trạng thái đơn hàng:</span>
                    <p className={`font-medium ${order.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.status === 'pending' ? 'Chờ xử lý' :
                       order.status === 'confirmed' ? 'Đã xác nhận' :
                       order.status === 'processing' ? 'Đang xử lý' :
                       order.status === 'shipping' ? 'Đang giao hàng' :
                       order.status === 'delivered' ? 'Đã giao hàng' : 'Đã hủy'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Trạng thái thanh toán:</span>
                    <p className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                       order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                       order.paymentStatus === 'failed' ? 'Thanh toán thất bại' : 'Đã hoàn tiền'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {paymentInfo && (
              <div className="px-6 py-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thanh toán VNPay</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Mã giao dịch VNPay:</span>
                    <p className="font-medium">{paymentInfo.transactionNo || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngân hàng:</span>
                    <p className="font-medium">{paymentInfo.bankCode || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Thời gian thanh toán:</span>
                    <p className="font-medium">{paymentInfo.payDate || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mã phản hồi:</span>
                    <p className="font-medium">{paymentInfo.responseCode}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Số tiền:</span>
                    <p className="font-medium">{formatVND(paymentInfo.amount)}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="px-6 py-6 flex justify-center space-x-4">
              <button
                onClick={() => navigate('/orders')}
                className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                Xem đơn hàng
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VnpayReturnPage;