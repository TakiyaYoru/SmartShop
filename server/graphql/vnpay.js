import * as vnpayService from '../services/vnpayService.js';

export const typeDefs = `
  type VnpayBank {
    bankCode: String!
    bankName: String!
  }

  type VnpayPaymentResult {
    success: Boolean!
    paymentUrl: String
    orderNumber: String!
    amount: Float!
    message: String!
  }

  type VnpayPaymentInfo {
    transactionNo: String
    amount: Float!
    bankCode: String
    payDate: String
    responseCode: String!
  }

  type VnpayReturnResult {
    success: Boolean!
    order: Order
    paymentInfo: VnpayPaymentInfo
    message: String!
  }

  extend type Query {
    getVnpayBanks: [VnpayBank!]!
  }

  extend type Mutation {
    createVnpayPaymentUrl(orderNumber: String!, bankCode: String): VnpayPaymentResult!
    handleVnpayReturn(
      vnp_TxnRef: String!
      vnp_Amount: String!
      vnp_ResponseCode: String!
      vnp_TransactionNo: String
      vnp_BankCode: String
      vnp_PayDate: String
      vnp_SecureHash: String!
    ): VnpayReturnResult!
  }
`;

export const resolvers = {
  Query: {
    getVnpayBanks: async () => {
      try {
        const banks = await vnpayService.getBankList();
        return banks;
      } catch (error) {
        console.error('❌ Error fetching VNPay banks:', error);
        throw new Error('Không thể lấy danh sách ngân hàng');
      }
    }
  },
  Mutation: {
    createVnpayPaymentUrl: async (parent, { orderNumber, bankCode }, { req, user, db }) => {
      try {
        if (!user) {
          throw new Error('Bạn cần đăng nhập để thực hiện thanh toán');
        }
        const order = await db.orders.getByOrderNumber(orderNumber);
        if (!order) {
          throw new Error('Không tìm thấy đơn hàng');
        }
        const orderUserId = typeof order.userId === 'object' ? order.userId._id?.toString() : order.userId?.toString();
        if (orderUserId !== user._id?.toString()) {
          throw new Error('Bạn không có quyền truy cập đơn hàng này');
        }
        if (order.paymentStatus === 'paid') {
          throw new Error('Đơn hàng đã được thanh toán');
        }
        if (order.status === 'cancelled') {
          throw new Error('Đơn hàng đã bị hủy');
        }
        const orderData = {
          orderNumber: order.orderNumber,
          amount: order.totalAmount,
          orderInfo: `Thanh toan don hang ${order.orderNumber} - SmartShop`,
          bankCode: bankCode || ''
        };
        const result = vnpayService.createPaymentUrl(req, orderData);
        if (!result.success) {
          throw new Error(result.error || 'Không thể tạo URL thanh toán');
        }
        await db.orders.updateById(order._id, {
          paymentMethod: 'vnpay',
          vnpayData: { paymentUrl: result.paymentUrl, orderInfo: orderData.orderInfo }
        });
        return {
          success: true,
          paymentUrl: result.paymentUrl,
          orderNumber: order.orderNumber,
          amount: order.totalAmount,
          message: 'URL thanh toán đã được tạo thành công'
        };
      } catch (error) {
        console.error('❌ Error creating VNPay payment URL:', error);
        return {
          success: false,
          paymentUrl: null,
          orderNumber,
          amount: 0,
          message: error.message
        };
      }
    },
    handleVnpayReturn: async (parent, args, { db }) => {
      try {
        const vnp_Params = {
          vnp_TxnRef: args.vnp_TxnRef,
          vnp_Amount: args.vnp_Amount,
          vnp_ResponseCode: args.vnp_ResponseCode,
          vnp_TransactionNo: args.vnp_TransactionNo,
          vnp_BankCode: args.vnp_BankCode,
          vnp_PayDate: args.vnp_PayDate,
          vnp_SecureHash: args.vnp_SecureHash
        };
        const verification = vnpayService.verifyReturnUrl(vnp_Params);
        if (!verification.isValid) {
          throw new Error('Chữ ký không hợp lệ');
        }
        const paymentInfo = vnpayService.extractPaymentInfo(vnp_Params);
        const order = await db.orders.getByOrderNumber(paymentInfo.orderNumber);
        if (!order) {
          throw new Error('Không tìm thấy đơn hàng');
        }
        const updateData = {
          paymentStatus: verification.isSuccess ? 'paid' : 'failed',
          vnpayData: {
            transactionNo: paymentInfo.transactionNo,
            bankCode: paymentInfo.bankCode,
            cardType: paymentInfo.cardType,
            payDate: paymentInfo.payDate ? new Date(
              `${paymentInfo.payDate.substring(0, 4)}-${paymentInfo.payDate.substring(4, 6)}-${paymentInfo.payDate.substring(6, 8)}T${paymentInfo.payDate.substring(8, 10)}:${paymentInfo.payDate.substring(10, 12)}:${paymentInfo.payDate.substring(12, 14)}`
            ) : new Date(),
            responseCode: paymentInfo.responseCode,
            returnUrlAccessed: true,
            returnUrlAccessedAt: new Date()
          }
        };
        if (verification.isSuccess && order.status === 'pending') {
          updateData.status = 'confirmed';
          updateData.confirmedAt = new Date();
        }
        const updatedOrder = await db.orders.updateById(order._id, updateData);
        return {
          success: verification.isSuccess,
          order: updatedOrder,
          paymentInfo: {
            transactionNo: paymentInfo.transactionNo,
            amount: paymentInfo.amount,
            bankCode: paymentInfo.bankCode,
            payDate: paymentInfo.payDate,
            responseCode: paymentInfo.responseCode
          },
          message: vnpayService.getPaymentMessage(paymentInfo.responseCode)
        };
      } catch (error) {
        console.error('❌ Error handling VNPay return:', error);
        throw error;
      }
    }
  }
};