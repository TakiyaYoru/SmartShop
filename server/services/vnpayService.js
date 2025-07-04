import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';

// VNPay Configuration từ .env
const VNP_TMN_CODE = process.env.VNP_TMN_CODE || '6VG5JVBM';
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || 'MA0XYERKJ1SDULL52ZD8RX3SBFDC5OYM';
const VNP_URL = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNP_RETURN_URL = process.env.VNP_RETURN_URL || 'https://27d3-14-169-85-118.ngrok-free.app/payment/vnpay-return';
const VNP_IPN_URL = process.env.VNP_IPN_URL || 'http://localhost:4000/api/payment/vnpay-ipn';

// VNPay Response Codes
const VNPAY_RESPONSE_CODES = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
  '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
  '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
  '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
  '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
  '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
  '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
  '75': 'Ngân hàng thanh toán đang bảo trì.',
  '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
  '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
};

// Danh sách ngân hàng
const BANK_LIST = [
  { bankCode: 'VNPAYQR', bankName: 'Cổng thanh toán VNPAYQR' },
  { bankCode: 'VNBANK', bankName: 'Ngân hàng Việt Nam Thịnh vượng' },
  { bankCode: 'VIETCOMBANK', bankName: 'Ngân hàng Ngoại Thương Việt Nam' },
  // ... (giữ nguyên danh sách ngân hàng)
];

// Utility Functions
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SHOP${timestamp}${random}`;
};

const sortObject = (obj) => {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};

const createSignature = (data, secretKey) => {
  const hmac = crypto.createHmac('sha512', secretKey);
  return hmac.update(Buffer.from(data, 'utf-8')).digest('hex');
};

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
         req.ip ||
         '127.0.0.1';
};

const validateOrderData = (orderData) => {
  if (!orderData.orderNumber) {
    throw new Error('Order number is required');
  }
  if (!orderData.amount || orderData.amount <= 0) {
    throw new Error('Amount must be a positive number');
  }
  if (!orderData.orderInfo) {
    throw new Error('Order info is required');
  }
};

const createPaymentUrl = (req, orderData) => {
  try {
    console.log('🔄 Creating VNPay payment URL for:', orderData);

    const { orderNumber, amount, orderInfo, bankCode, locale = 'vn' } = orderData;

    if (!VNP_TMN_CODE || !VNP_HASH_SECRET) {
      throw new Error('VNPay configuration is missing');
    }

    validateOrderData(orderData);

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss');
    const ipAddr = getClientIp(req);

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNP_TMN_CODE,
      vnp_Locale: locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderNumber,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: VNP_RETURN_URL,
      vnp_IpnUrl: VNP_IPN_URL,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
      vnp_IpAddr: ipAddr
    };

    if (bankCode) {
      vnp_Params.vnp_BankCode = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const querystring = qs.stringify(vnp_Params);
    vnp_Params.vnp_SecureHash = createSignature(querystring, VNP_HASH_SECRET);

    const paymentUrl = `${VNP_URL}?${qs.stringify(vnp_Params)}`;

    return {
      success: true,
      paymentUrl,
      orderNumber,
      amount
    };
  } catch (error) {
    console.error('❌ Error creating VNPay payment URL:', error);
    return {
      success: false,
      error: error.message,
      paymentUrl: null,
      orderNumber,
      amount
    };
  }
};

const verifyReturnUrl = (vnp_Params) => {
  try {
    console.log('🔍 Verifying VNPay return URL signature');
    
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const sorted = sortObject(vnp_Params);
    const signData = qs.stringify(sorted);
    const signed = createSignature(signData, VNP_HASH_SECRET);

    return {
      isValid: secureHash === signed,
      isSuccess: vnp_Params.vnp_ResponseCode === '00',
      responseCode: vnp_Params.vnp_ResponseCode
    };
  } catch (error) {
    console.error('❌ Error verifying return URL:', error);
    return { isValid: false, isSuccess: false, responseCode: '99' };
  }
};

const verifyIpnCall = (vnp_Params) => {
  try {
    console.log('🔍 Verifying VNPay IPN signature');
    
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const sorted = sortObject(vnp_Params);
    const signData = qs.stringify(sorted);
    const signed = createSignature(signData, VNP_HASH_SECRET);

    return {
      isValid: secureHash === signed,
      isSuccess: vnp_Params.vnp_ResponseCode === '00',
      responseCode: vnp_Params.vnp_ResponseCode
    };
  } catch (error) {
    console.error('❌ Error verifying IPN:', error);
    return { isValid: false, isSuccess: false, responseCode: '99' };
  }
};

const extractPaymentInfo = (vnp_Params) => {
  return {
    orderNumber: vnp_Params.vnp_TxnRef,
    amount: vnp_Params.vnp_Amount ? parseInt(vnp_Params.vnp_Amount) / 100 : 0,
    transactionNo: vnp_Params.vnp_TransactionNo,
    bankCode: vnp_Params.vnp_BankCode,
    cardType: vnp_Params.vnp_CardType,
    payDate: vnp_Params.vnp_PayDate,
    responseCode: vnp_Params.vnp_ResponseCode,
    orderInfo: vnp_Params.vnp_OrderInfo
  };
};

const createIpnResponse = (rspCode, message) => {
  return { RspCode: rspCode, Message: message };
};

const getPaymentMessage = (responseCode) => {
  return VNPAY_RESPONSE_CODES[responseCode] || 'Lỗi không xác định';
};

const getBankList = async () => {
  try {
    return BANK_LIST;
  } catch (error) {
    console.error('❌ Error getting bank list:', error);
    return [];
  }
};

const checkVnpayConfig = () => {
  const isConfigured = !!(VNP_TMN_CODE && VNP_HASH_SECRET);
  return {
    isConfigured,
    config: {
      tmnCode: VNP_TMN_CODE,
      hasSecret: !!VNP_HASH_SECRET,
      url: VNP_URL,
      returnUrl: VNP_RETURN_URL,
      ipnUrl: VNP_IPN_URL
    }
  };
};

console.log('✅ VNPay Service initialized');

export {
  generateOrderId,
  validateOrderData,
  createPaymentUrl,
  verifyReturnUrl,
  verifyIpnCall,
  extractPaymentInfo,
  createIpnResponse,
  getPaymentMessage,
  getBankList,
  checkVnpayConfig
};