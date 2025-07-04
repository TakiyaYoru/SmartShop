import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  CreditCardIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  UserIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CREATE_ORDER } from '../graphql/orders';
import { CREATE_VNPAY_PAYMENT_URL, GET_VNPAY_BANKS } from '../graphql/vnpay';
import { SmartImage } from '../utils/imageHelper';

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading: cartLoading, error: cartError, clearCart } = useCart();
  const { items, subtotal, totalItems } = cart;
  const isEmpty = !items || items.length === 0;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: ''
  });
  const [orderPrefs, setOrderPrefs] = useState({
    paymentMethod: 'cod',
    selectedBank: '',
    invoiceRequired: false
  });
  const [errors, setErrors] = useState({});

  const { data: bankData } = useQuery(GET_VNPAY_BANKS, {
    onError: (error) => toast.error('Không thể tải danh sách ngân hàng: ' + error.message)
  });
  const banks = bankData?.getVnpayBanks || [];

  const [createVnpayPaymentUrl] = useMutation(CREATE_VNPAY_PAYMENT_URL, {
    onCompleted: (data) => {
      if (data.createVnpayPaymentUrl.success) {
        window.location.href = data.createVnpayPaymentUrl.paymentUrl;
      } else {
        setLoading(false);
        toast.error(data.createVnpayPaymentUrl.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || 'Có lỗi khi tạo thanh toán VNPay');
    }
  });

  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: async (data) => {
      if (data.createOrderFromCart) {
        const newOrder = data.createOrderFromCart;
        if (orderPrefs.paymentMethod === 'vnpay') {
          await createVnpayPaymentUrl({
            variables: { orderNumber: newOrder.orderNumber, bankCode: orderPrefs.selectedBank }
          });
        } else {
          setLoading(false);
          toast.success('Đặt hàng thành công!');
          clearCart();
          navigate(`/orders/${newOrder.orderNumber}/success`);
        }
      }
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || 'Có lỗi khi tạo đơn hàng');
    }
  });

  useEffect(() => {
    if (!cartLoading && isEmpty) {
      toast.error('Giỏ hàng trống!');
      navigate('/cart');
    }
  }, [isEmpty, cartLoading, navigate]);

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOrderPrefsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderPrefs(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customerInfo.fullName.trim()) newErrors.fullName = 'Họ tên là bắt buộc';
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!customerInfo.address.trim()) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!customerInfo.city.trim()) newErrors.city = 'Thành phố là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async () => {
    if (loading) return;
    if (!validateForm()) {
      setCurrentStep(1);
      return;
    }
    setLoading(true);
    try {
      await createOrder({
        variables: {
          input: {
            customerInfo: {
              fullName: customerInfo.fullName,
              phone: customerInfo.phone,
              address: customerInfo.address,
              city: customerInfo.city,
              notes: customerInfo.notes
            },
            paymentMethod: orderPrefs.paymentMethod,
            customerNotes: customerInfo.notes
          }
        }
      });
    } catch (error) {
      setLoading(false);
      console.error('Order creation error:', error);
    }
  };

  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;

  const PaymentMethodSelection = () => (
    <div className="space-y-4">
      <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
        <input
          type="radio"
          name="paymentMethod"
          value="cod"
          checked={orderPrefs.paymentMethod === 'cod'}
          onChange={handleOrderPrefsChange}
          className="mt-1 text-blue-600"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <BanknotesIcon className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng
          </p>
        </div>
      </label>
      <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
        <input
          type="radio"
          name="paymentMethod"
          value="bank_transfer"
          checked={orderPrefs.paymentMethod === 'bank_transfer'}
          onChange={handleOrderPrefsChange}
          className="mt-1 text-blue-600"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <CreditCardIcon className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Chuyển khoản ngân hàng</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Chuyển khoản qua thông tin tài khoản của shop
          </p>
        </div>
      </label>
      <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
        <input
          type="radio"
          name="paymentMethod"
          value="vnpay"
          checked={orderPrefs.paymentMethod === 'vnpay'}
          onChange={handleOrderPrefsChange}
          className="mt-1 text-blue-600"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <CreditCardIcon className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-gray-900">Thanh toán qua VNPay</span>
            <img 
              src="https://vnpay.vn/wp-content/uploads/2020/07/vnpay-logo.png" 
              alt="VNPay" 
              className="ml-2 h-5"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 mb-3">
            Thanh toán trực tuyến qua thẻ ATM, Internet Banking, Visa/MasterCard
          </p>
          {orderPrefs.paymentMethod === 'vnpay' && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn ngân hàng (tùy chọn)
              </label>
              <select
                name="selectedBank"
                value={orderPrefs.selectedBank}
                onChange={handleOrderPrefsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Chọn ngân hàng (tùy chọn)</option>
                {banks.map(bank => (
                  <option key={bank.bankCode} value={bank.bankCode}>{bank.bankName}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </label>
    </div>
  );

  const OrderSummary = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ShoppingBagIcon className="w-5 h-5 mr-2" />
        Tóm tắt đơn hàng
      </h3>
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items?.map((item) => (
          <div key={item.productId} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <SmartImage
                src={item.product?.images?.[0]}
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
              <p className="text-sm text-gray-600">{formatVND(item.unitPrice)} × {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">{formatVND(item.totalPrice)}</p>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
          <span className="text-gray-900">{formatVND(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="text-green-600">Miễn phí</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
          <span className="text-lg font-bold text-blue-600">{formatVND(totalAmount)}</span>
        </div>
      </div>
    </div>
  );

  const CustomerInfoForm = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <UserIcon className="w-5 h-5 mr-2" />
        Thông tin người nhận
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
          <input
            type="text"
            name="fullName"
            value={customerInfo.fullName}
            onChange={handleCustomerInfoChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nhập họ và tên"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
          <input
            type="tel"
            name="phone"
            value={customerInfo.phone}
            onChange={handleCustomerInfoChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nhập số điện thoại"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleCustomerInfoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập email (tùy chọn)"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
          <input
            type="text"
            name="address"
            value={customerInfo.address}
            onChange={handleCustomerInfoChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nhập địa chỉ cụ thể"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố *</label>
          <input
            type="text"
            name="city"
            value={customerInfo.city}
            onChange={handleCustomerInfoChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nhập thành phố"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện</label>
          <input
            type="text"
            name="district"
            value={customerInfo.district}
            onChange={handleCustomerInfoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập quận/huyện"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng</label>
          <textarea
            name="notes"
            value={customerInfo.notes}
            onChange={handleCustomerInfoChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
          />
        </div>
      </div>
    </div>
  );

  const StepsIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
          <span className="font-medium">Thông tin</span>
        </div>
        <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
          <span className="font-medium">Thanh toán</span>
        </div>
      </div>
    </div>
  );

  if (cartLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (cartError) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Có lỗi xảy ra: {cartError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
              <p className="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn</p>
            </div>
            <StepsIndicator />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {currentStep === 1 && (
                  <>
                    <CustomerInfoForm />
                    <div className="flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
                      >
                        Tiếp tục
                        <ArrowLeftIcon className="w-5 h-5 ml-2 rotate-180" />
                      </button>
                    </div>
                  </>
                )}
                {currentStep === 2 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <CreditCardIcon className="w-5 h-5 mr-2" />
                      Phương thức thanh toán
                    </h3>
                    <PaymentMethodSelection />
                    <div className="mt-6 pt-6 border-t">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="invoiceRequired"
                          checked={orderPrefs.invoiceRequired}
                          onChange={handleOrderPrefsChange}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">
                          Xuất hóa đơn công ty (Điền email để nhận hóa đơn VAT)
                        </span>
                      </label>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t mt-6">
                      <button
                        onClick={handlePrevStep}
                        className="flex items-center text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Quay lại
                      </button>
                      <button
                        onClick={handleSubmitOrder}
                        disabled={loading}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center ${
                          loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                          orderPrefs.paymentMethod === 'vnpay' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
                          'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {orderPrefs.paymentMethod === 'vnpay' ? 'Đang chuyển đến VNPay...' : 'Đang xử lý...'}
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            {orderPrefs.paymentMethod === 'vnpay' ? 
                             `Thanh toán ${formatVND(totalAmount)} qua VNPay` : 
                             `Đặt hàng ${formatVND(totalAmount)}`}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <OrderSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CheckoutPage;