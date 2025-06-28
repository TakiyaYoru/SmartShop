import mongoose from "mongoose";

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
    items: [OrderItem!]!
    orderDate: String!
    confirmedAt: String
    processedAt: String
    shippedAt: String
    deliveredAt: String
    cancelledAt: String
    customerNotes: String
    adminNotes: String
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    _id: ID!
    orderId: ID!
    productId: ID!
    product: Product
    productName: String!
    productSku: String!
    quantity: Int!
    unitPrice: Float!
    totalPrice: Float!
    productSnapshot: ProductSnapshot
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

  input CustomerInfoInput {
    fullName: String!
    phone: String!
    address: String!
    city: String!
    notes: String
  }

  input CreateOrderInput {
    customerInfo: CustomerInfoInput!
    paymentMethod: PaymentMethod!
    customerNotes: String
  }

  input OrderConditionInput {
    status: OrderStatus
    paymentStatus: PaymentStatus
    paymentMethod: PaymentMethod
    userId: ID
    dateFrom: String
    dateTo: String
  }

  extend type Query {
    # Customer queries
    getMyOrders(
      first: Int = 10,
      offset: Int = 0,
      orderBy: OrdersOrderBy = DATE_DESC
    ): OrderConnection!
    
    getMyOrder(orderNumber: String!): Order
    
    # Admin queries  
    getAllOrders(
      first: Int = 10,
      offset: Int = 0,
      orderBy: OrdersOrderBy = DATE_DESC,
      condition: OrderConditionInput,
      search: String
    ): OrderConnection!
    
    getOrder(orderNumber: String!): Order
    
    # Statistics
    getOrderStats: OrderStats!
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

  extend type Mutation {
    # Customer mutations
    createOrderFromCart(input: CreateOrderInput!): Order!
    
    # Admin mutations
    updateOrderStatus(orderNumber: String!, status: OrderStatus!, adminNotes: String): Order!
    updatePaymentStatus(orderNumber: String!, paymentStatus: PaymentStatus!): Order!
    cancelOrder(orderNumber: String!, reason: String): Order!
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
      console.log('Resolving order items for order:', parent._id);
      try {
        const items = await context.db.orderItems.getByOrderId(parent._id);
        console.log('Order items resolved:', items);
        return items;
      } catch (error) {
        console.error('Error resolving order items:', error);
        return [];
      }
    }
  },

  OrderItem: {
    product: async (parent, args, context) => {
      try {
        if (!parent.productId) {
          console.log('OrderItem productId is null/undefined:', parent);
          return null;
        }
        
        // Check if productId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(parent.productId)) {
          console.log('Invalid productId format:', parent.productId);
          return null;
        }
        
        const product = await context.db.products.findById(parent.productId);
        if (!product) {
          console.log('Product not found for productId:', parent.productId);
          return null;
        }
        
        return product;
      } catch (error) {
        console.error('Error resolving OrderItem product:', error);
        return null;
      }
    }
  },

  Query: {
    getMyOrders: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      console.log('Getting orders for user:', context.user.id);
      
      const result = await context.db.orders.getByUserId(context.user.id, args);
      
      const { first = 10, offset = 0 } = args;
      const hasNextPage = offset + first < result.totalCount;
      const hasPreviousPage = offset > 0;
      
      return {
        nodes: result.items,
        totalCount: result.totalCount,
        hasNextPage,
        hasPreviousPage
      };
    },

    getMyOrder: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const order = await context.db.orders.getByOrderNumber(args.orderNumber);
      
      if (!order) {
        throw new Error("Order not found");
      }

      // Kiểm tra order có thuộc về user này không
      if (order.userId.toString() !== context.user.id) {
        throw new Error("Access denied");
      }

      return order;
    },

    getAllOrders: async (parent, args, context, info) => {
      // Admin only - will be protected by permissions
      console.log('Getting all orders with args:', args);
      
      const result = await context.db.orders.getAll({
        first: args.first,
        offset: args.offset,
        orderBy: args.orderBy,
        condition: args.condition,
        search: args.search
      });
      
      const { first = 10, offset = 0 } = args;
      const hasNextPage = offset + first < result.totalCount;
      const hasPreviousPage = offset > 0;
      
      return {
        nodes: result.items,
        totalCount: result.totalCount,
        hasNextPage,
        hasPreviousPage
      };
    },

    getOrder: async (parent, args, context, info) => {
      // Admin only
      return await context.db.orders.getByOrderNumber(args.orderNumber);
    },

    getOrderStats: async (parent, args, context, info) => {
      // Admin only
      return await context.db.orders.getStats();
    }
  },

  Mutation: {
    createOrderFromCart: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      console.log('Creating order from cart for user:', context.user.id);
      console.log('Order input:', args.input);

      try {
        // Validate cart
        const cartValidation = await context.db.carts.validateCart(context.user.id);
        
        if (!cartValidation.isValid) {
          throw new Error(`Cart validation failed: ${cartValidation.errors.join(', ')}`);
        }

        if (cartValidation.validItems.length === 0) {
          throw new Error('Cart is empty');
        }

        // Create order
        const order = await context.db.orders.createFromCart(context.user.id, args.input);
        
        console.log('Order created successfully:', order.orderNumber);
        
        return order;
      } catch (error) {
        console.error('Error creating order:', error);
        throw error;
      }
    },

    updateOrderStatus: async (parent, args, context, info) => {
      // Admin only
      console.log('Updating order status:', args);
      
      const order = await context.db.orders.updateStatus(
        args.orderNumber, 
        args.status, 
        args.adminNotes
      );
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    },

    updatePaymentStatus: async (parent, args, context, info) => {
      // Admin only
      console.log('Updating payment status:', args);
      
      const order = await context.db.orders.updatePaymentStatus(
        args.orderNumber, 
        args.paymentStatus
      );
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    },

    cancelOrder: async (parent, args, context, info) => {
      // Admin only
      console.log('Cancelling order:', args);
      
      const order = await context.db.orders.cancelOrder(
        args.orderNumber, 
        args.reason
      );
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    }
  }
};