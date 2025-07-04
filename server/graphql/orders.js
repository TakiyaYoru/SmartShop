import mongoose from "mongoose";
import * as vnpayService from '../services/vnpayService.js';

export const typeDef = `
  type Order {
    _id: ID!
    orderNumber: String!
    userId: ID!
    user: UserInfo
    customerInfo: CustomerInfo!
    status: OrderStatus!
    paymentMethod: PaymentMethod!
    paymentStatus: PaymentStatus!
    subtotal: Float!
    totalAmount: Float!
    orderDate: String!
    confirmedAt: String
    processedAt: String
    shippedAt: String
    deliveredAt: String
    cancelledAt: String
    customerNotes: String
    adminNotes: String
    items: [OrderItem!]!
    vnpayData: VnpayData
  }

  type VnpayData {
    paymentUrl: String
    orderInfo: String
    transactionNo: String
    bankCode: String
    cardType: String
    payDate: String
    responseCode: String
    ipnReceived: Boolean
    ipnReceivedAt: String
    returnUrlAccessed: Boolean
    returnUrlAccessedAt: String
  }

  type OrderItem {
    _id: ID!
    productId: ID!
    productName: String!
    productSku: String!
    quantity: Int!
    unitPrice: Float!
    totalPrice: Float!
    productSnapshot: ProductSnapshot
    product: Product
  }

  type ProductSnapshot {
    description: String
    images: [String]
    brand: String
    category: String
  }

  type CustomerInfo {
    fullName: String!
    phone: String!
    address: String!
    city: String!
    notes: String
  }

  enum OrderStatus {
    pending
    confirmed
    processing
    shipping
    delivered
    cancelled
  }

  enum PaymentMethod {
    cod
    bank_transfer
    vnpay
  }

  enum PaymentStatus {
    pending
    paid
    failed
    refunded
  }

  enum OrdersOrderBy {
    DATE_ASC
    DATE_DESC
    STATUS_ASC
    STATUS_DESC
    TOTAL_ASC
    TOTAL_DESC
  }

  type OrderConnection {
    nodes: [Order!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  input CreateOrderInput {
    customerInfo: CustomerInfoInput!
    paymentMethod: PaymentMethod!
    customerNotes: String
  }

  input CustomerInfoInput {
    fullName: String!
    phone: String!
    address: String!
    city: String!
    notes: String
  }

  input OrderConditionInput {
    status: OrderStatus
    paymentStatus: PaymentStatus
    paymentMethod: PaymentMethod
    userId: ID
    dateFrom: String
    dateTo: String
  }

  type OrderStats {
    totalOrders: Int!
    pendingOrders: Int!
    confirmedOrders: Int!
    shippingOrders: Int!
    deliveredOrders: Int!
    cancelledOrders: Int!
    totalRevenue: Float!
    todayOrders: Int!
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
    getMyOrders(first: Int, offset: Int, orderBy: OrdersOrderBy): OrderConnection!
    getMyOrder(orderNumber: String!): Order
    getAllOrders(first: Int, offset: Int, orderBy: OrdersOrderBy, condition: OrderConditionInput, search: String): OrderConnection!
    getOrder(orderNumber: String!): Order
    getOrderStats: OrderStats!
  }

  extend type Mutation {
    createOrderFromCart(input: CreateOrderInput!): Order!
    updateOrderStatus(orderNumber: String!, status: OrderStatus!, adminNotes: String): Order!
    updatePaymentStatus(orderNumber: String!, paymentStatus: PaymentStatus!): Order!
    cancelOrder(orderNumber: String!, reason: String): Order!
    createVnpayPaymentUrl(orderNumber: String!, bankCode: String): VnpayPaymentResult!
    handleVnpayReturn(vnp_TxnRef: String!, vnp_Amount: String!, vnp_ResponseCode: String!, vnp_TransactionNo: String, vnp_BankCode: String, vnp_PayDate: String, vnp_SecureHash: String!): VnpayReturnResult!
  }
`;

export const resolvers = {
  Order: {
    user: async (parent, args, context) => {
      if (parent.userId) {
        return await context.db.users.findById(parent.userId);
      }
      return null;
    },
    items: async (parent, args, context) => {
      return await context.db.orderItems.getByOrderId(parent._id);
    }
  },

  OrderItem: {
    product: async (parent, args, context) => {
      if (parent.productId) {
        return await context.db.products.findById(parent.productId);
      }
      return null;
    }
  },

  Query: {
    getMyOrders: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      const { first = 10, offset = 0, orderBy = 'DATE_DESC' } = args;
      const result = await context.db.orders.getByUserId(context.user._id, { first, offset, orderBy });
      return {
        nodes: result.items,
        totalCount: result.totalCount,
        hasNextPage: offset + first < result.totalCount,
        hasPreviousPage: offset > 0
      };
    },

    getMyOrder: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      const order = await context.db.orders.getByOrderNumber(args.orderNumber);
      if (!order) {
        throw new Error("Order not found");
      }
      const orderUserId = typeof order.userId === 'object' ? order.userId._id?.toString() : order.userId?.toString();
      if (orderUserId !== context.user._id?.toString()) {
        throw new Error("You don't have permission to view this order");
      }
      return order;
    },

    getAllOrders: async (parent, args, context) => {
      const { first = 10, offset = 0, orderBy = 'DATE_DESC', condition, search } = args;
      const result = await context.db.orders.getAll({ first, offset, orderBy, condition, search });
      return {
        nodes: result.items,
        totalCount: result.totalCount,
        hasNextPage: offset + first < result.totalCount,
        hasPreviousPage: offset > 0
      };
    },

    getOrder: async (parent, args, context) => {
      const order = await context.db.orders.getByOrderNumber(args.orderNumber);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    },

    getOrderStats: async (parent, args, context) => {
      return await context.db.orders.getStats();
    }
  },

  Mutation: {
    createOrderFromCart: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      try {
        const cartItems = await context.db.carts.getByUserId(context.user._id);
        if (!cartItems || cartItems.length === 0) {
          throw new Error("Cart is empty");
        }
        let subtotal = 0;
        const orderItems = [];
        for (const cartItem of cartItems) {
          const product = await context.db.products.findById(cartItem.productId);
          if (!product) {
            throw new Error(`Product ${cartItem.productName} not found`);
          }
          if (product.stock < cartItem.quantity) {
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${cartItem.quantity}`);
          }
          const totalPrice = product.price * cartItem.quantity;
          subtotal += totalPrice;
          orderItems.push({
            productId: cartItem.productId,
            productName: product.name,
            productSku: product.sku,
            quantity: cartItem.quantity,
            unitPrice: product.price,
            totalPrice: totalPrice,
            productSnapshot: {
              description: product.description,
              images: product.images || [],
              brand: product.brand?.name || '',
              category: product.category?.name || ''
            }
          });
        }
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const orderData = {
          orderNumber,
          userId: context.user._id,
          customerInfo: args.input.customerInfo,
          status: 'pending',
          paymentMethod: args.input.paymentMethod,
          paymentStatus: 'pending',
          subtotal,
          totalAmount: subtotal,
          customerNotes: args.input.customerNotes,
          orderDate: new Date()
        };
        const order = await context.db.orders.create(orderData);
        for (const orderItem of orderItems) {
          orderItem.orderId = order._id;
          await context.db.orderItems.create(orderItem);
        }
        for (const cartItem of cartItems) {
          const product = await context.db.products.findById(cartItem.productId);
          await context.db.products.updateById(cartItem.productId, { stock: product.stock - cartItem.quantity });
        }
        await context.db.carts.clearByUserId(context.user._id);
        return await context.db.orders.findById(order._id);
      } catch (error) {
        console.error('Error creating order:', error);
        throw error;
      }
    },

    updateOrderStatus: async (parent, args, context) => {
      try {
        const order = await context.db.orders.getByOrderNumber(args.orderNumber);
        if (!order) {
          throw new Error('Order not found');
        }
        const updateData = { status: args.status, adminNotes: args.adminNotes };
        const now = new Date();
        switch (args.status) {
          case 'confirmed': updateData.confirmedAt = now; break;
          case 'processing': updateData.processedAt = now; break;
          case 'shipping': updateData.shippedAt = now; break;
          case 'delivered': updateData.deliveredAt = now; updateData.paymentStatus = 'paid'; break;
          case 'cancelled': updateData.cancelledAt = now; break;
        }
        return await context.db.orders.updateById(order._id, updateData);
      } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },

    updatePaymentStatus: async (parent, args, context) => {
      try {
        const order = await context.db.orders.getByOrderNumber(args.orderNumber);
        if (!order) {
          throw new Error('Order not found');
        }
        const updateData = { paymentStatus: args.paymentStatus };
        if (args.paymentStatus === 'paid' && order.status === 'pending') {
          updateData.status = 'confirmed';
          updateData.confirmedAt = new Date();
        }
        return await context.db.orders.updateById(order._id, updateData);
      } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }
    },

    cancelOrder: async (parent, args, context) => {
      try {
        const order = await context.db.orders.getByOrderNumber(args.orderNumber);
        if (!order) {
          throw new Error('Order not found');
        }
        if (context.user.role === 'customer') {
          const orderUserId = typeof order.userId === 'object' ? order.userId._id?.toString() : order.userId?.toString();
          if (orderUserId !== context.user._id?.toString()) {
            throw new Error('You can only cancel your own orders');
          }
          if (!['pending', 'confirmed'].includes(order.status)) {
            throw new Error('This order cannot be cancelled anymore');
          }
        }
        return await context.db.orders.cancel(args.orderNumber, args.reason || (context.user.role === 'customer' ? 'Khách hàng yêu cầu hủy đơn' : args.reason));
      } catch (error) {
        console.error('Error cancelling order:', error);
        throw error;
      }
    },

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
        const mockReq = req && req.headers ? req : {
          headers: { 'x-forwarded-for': '127.0.0.1', 'x-real-ip': '127.0.0.1', 'x-client-ip': '127.0.0.1' },
          ip: '127.0.0.1',
          connection: { remoteAddress: '127.0.0.1' }
        };
        const result = vnpayService.createPaymentUrl(mockReq, orderData);
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
        console.error('Error creating VNPay payment URL:', error);
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
        console.error('Error handling VNPay return:', error);
        throw error;
      }
    }
  }
};