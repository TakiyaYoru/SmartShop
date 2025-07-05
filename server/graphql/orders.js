// File: server/graphql/orders.js - FIXED SYNTAX VERSION

import mongoose from "mongoose";

export const typeDef = `
  type Order {
    _id: ID!
    orderNumber: String!
    userId: ID!
    user: UserInfo
    customerInfo: CustomerInfo!
    status: OrderStatus!
    paymentMethod: PaymentMethod
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

  extend type Query {
    # Customer queries
    getMyOrders(first: Int, offset: Int, orderBy: OrdersOrderBy): OrderConnection!
    getMyOrder(orderNumber: String!): Order
    
    # Admin queries  
    getAllOrders(first: Int, offset: Int, orderBy: OrdersOrderBy, condition: OrderConditionInput, search: String): OrderConnection!
    getOrder(orderNumber: String!): Order
    getOrderStats: OrderStats!
  }

  extend type Mutation {
    # Customer mutations
    createOrderFromCart(input: CreateOrderInput!): Order!
    
    # Admin mutations
    updateOrderStatus(orderNumber: String!, status: OrderStatus!, adminNotes: String): Order!
    updatePaymentStatus(orderNumber: String!, paymentStatus: PaymentStatus!): Order!
    cancelOrder(orderNumber: String!, reason: String): Order!
    fixInvalidOrders: Boolean!
    clearAllOrders: Boolean!
  }
`;

export const resolvers = {
  Order: {
    paymentMethod: (parent) => {
      try {
        // Handle null or invalid paymentMethod values
        console.log('🔍 Order.paymentMethod resolver - value:', parent.paymentMethod);
        
        // Always return a valid value
        if (!parent.paymentMethod || typeof parent.paymentMethod !== 'string') {
          console.log('🔍 Order.paymentMethod - returning default: cod');
          return 'cod';
        }
        
        // Check if the value is valid for the enum
        const validPaymentMethods = ['cod', 'bank_transfer'];
        if (!validPaymentMethods.includes(parent.paymentMethod)) {
          console.log('🔍 Order.paymentMethod - invalid value, returning default: cod');
          return 'cod';
        }
        
        console.log('🔍 Order.paymentMethod - returning valid value:', parent.paymentMethod);
        return parent.paymentMethod;
      } catch (error) {
        console.error('❌ Error in paymentMethod resolver:', error);
        return 'cod'; // Fallback to COD
      }
    },
    
    paymentStatus: (parent) => {
      try {
        // Handle null or invalid paymentStatus values
        console.log('🔍 Order.paymentStatus resolver - value:', parent.paymentStatus);
        
        if (!parent.paymentStatus) {
          console.log('🔍 Order.paymentStatus - returning default: pending');
          return 'pending'; // Default to pending
        }
        
        // Check if the value is valid for the enum
        const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        if (!validPaymentStatuses.includes(parent.paymentStatus)) {
          console.log('🔍 Order.paymentStatus - invalid value, returning default: pending');
          return 'pending'; // Default to pending for invalid values
        }
        
        console.log('🔍 Order.paymentStatus - returning valid value:', parent.paymentStatus);
        return parent.paymentStatus;
      } catch (error) {
        console.error('❌ Error in paymentStatus resolver:', error);
        return 'pending'; // Fallback to pending
      }
    },
    
    status: (parent) => {
      try {
        // Handle null or invalid status values
        console.log('🔍 Order.status resolver - value:', parent.status);
        
        if (!parent.status) {
          console.log('🔍 Order.status - returning default: pending');
          return 'pending'; // Default to pending
        }
        
        // Check if the value is valid for the enum
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];
        if (!validStatuses.includes(parent.status)) {
          console.log('🔍 Order.status - invalid value, returning default: pending');
          return 'pending'; // Default to pending for invalid values
        }
        
        console.log('🔍 Order.status - returning valid value:', parent.status);
        return parent.status;
      } catch (error) {
        console.error('❌ Error in status resolver:', error);
        return 'pending'; // Fallback to pending
      }
    },
    
    customerInfo: (parent) => {
      // Handle null or invalid customerInfo values
      if (!parent.customerInfo) {
        return {
          fullName: 'Unknown Customer',
          phone: 'N/A',
          address: 'N/A',
          city: 'N/A',
          notes: ''
        };
      }
      return parent.customerInfo;
    },
    
    user: async (parent, args, context) => {
      try {
        console.log('🔍 Order.user resolver - parent.userId:', parent.userId);
        if (parent.userId) {
          const user = await context.db.users.findById(parent.userId);
          console.log('👤 Order.user resolved:', user ? 'Found' : 'Not found');
          return user;
        }
        return null;
      } catch (error) {
        console.error('❌ Error resolving Order.user:', error);
        return null;
      }
    },
    
    items: async (parent, args, context) => {
      try {
        console.log('🔍 Order.items resolver - parent._id:', parent._id);
        
        if (!parent._id) {
          console.log('❌ Order _id is missing');
          return [];
        }
        
        // Check if orderItems method exists
        if (!context.db.orderItems) {
          console.error('❌ context.db.orderItems is undefined');
          console.log('🔍 Available db methods:', Object.keys(context.db));
          return [];
        }
        
        if (!context.db.orderItems.getByOrderId) {
          console.error('❌ context.db.orderItems.getByOrderId is undefined');
          console.log('🔍 Available orderItems methods:', Object.keys(context.db.orderItems));
          return [];
        }
        
        console.log('🔍 Calling context.db.orderItems.getByOrderId with:', parent._id);
        const items = await context.db.orderItems.getByOrderId(parent._id);
        console.log(`📦 Order items resolved: ${items?.length || 0} items`);
        
        return items || [];
      } catch (error) {
        console.error('❌ Error resolving order items:', error);
        console.error('❌ Full error stack:', error.stack);
        return [];
      }
    },
    
    // Handle null values for numeric fields
    subtotal: (parent) => {
      return parent.subtotal || 0;
    },
    
    totalAmount: (parent) => {
      return parent.totalAmount || 0;
    },
    
    // Handle null values for date fields
    orderDate: (parent) => {
      return parent.orderDate || new Date().toISOString();
    },
    
    confirmedAt: (parent) => {
      return parent.confirmedAt || null;
    },
    
    processedAt: (parent) => {
      return parent.processedAt || null;
    },
    
    shippedAt: (parent) => {
      return parent.shippedAt || null;
    },
    
    deliveredAt: (parent) => {
      return parent.deliveredAt || null;
    },
    
    cancelledAt: (parent) => {
      return parent.cancelledAt || null;
    },
    
    // Handle all potentially null fields
    orderNumber: (parent) => {
      return parent.orderNumber || `ORDER_${parent._id || 'UNKNOWN'}`;
    },
    
    customerNotes: (parent) => {
      return parent.customerNotes || '';
    },
    
    adminNotes: (parent) => {
      return parent.adminNotes || '';
    }
  },

  OrderItem: {
    product: async (parent, args, context) => {
      try {
        console.log('🔍 OrderItem.product resolver - productId:', parent.productId);
        
        if (!parent.productId) {
          console.log('❌ OrderItem productId is null/undefined');
          return null;
        }
        
        if (!mongoose.Types.ObjectId.isValid(parent.productId)) {
          console.log('❌ Invalid productId format:', parent.productId);
          return null;
        }
        
        const product = await context.db.products.findById(parent.productId);
        console.log('📦 OrderItem.product resolved:', product ? 'Found' : 'Not found');
        
        return product;
      } catch (error) {
        console.error('❌ Error resolving OrderItem product:', error);
        return null;
      }
    },
    
    // Handle null values for OrderItem fields
    productName: (parent) => {
      return parent.productName || 'Unknown Product';
    },
    
    productSku: (parent) => {
      return parent.productSku || 'N/A';
    },
    
    quantity: (parent) => {
      return parent.quantity || 0;
    },
    
    unitPrice: (parent) => {
      return parent.unitPrice || 0;
    },
    
    totalPrice: (parent) => {
      return parent.totalPrice || (parent.quantity || 0) * (parent.unitPrice || 0);
    },
    
    productSnapshot: (parent) => {
      if (!parent.productSnapshot) {
        return {
          description: 'Product information not available',
          images: [],
          brand: 'Unknown',
          category: 'Unknown'
        };
      }
      return parent.productSnapshot;
    }
  },
  
  ProductSnapshot: {
    description: (parent) => {
      return parent.description || 'No description available';
    },
    
    images: (parent) => {
      return parent.images || [];
    },
    
    brand: (parent) => {
      return parent.brand || 'Unknown';
    },
    
    category: (parent) => {
      return parent.category || 'Unknown';
    }
  },
  
  CustomerInfo: {
    fullName: (parent) => {
      return parent.fullName || 'Unknown Customer';
    },
    
    phone: (parent) => {
      return parent.phone || 'N/A';
    },
    
    address: (parent) => {
      return parent.address || 'N/A';
    },
    
    city: (parent) => {
      return parent.city || 'N/A';
    },
    
    notes: (parent) => {
      return parent.notes || '';
    }
  },

  Query: {
    getMyOrders: async (parent, args, context, info) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        console.log('🔍 getMyOrders - userId:', context.user.id);
        console.log('🔍 getMyOrders - userId type:', typeof context.user.id);
        console.log('🔍 getMyOrders - args:', args);
        
        // Convert string userId to ObjectId if needed
        const userId = context.user.id;
        const result = await context.db.orders.getByUserId(userId, args);
        
        console.log('📦 getMyOrders result:', {
          itemsCount: result.items?.length || 0,
          totalCount: result.totalCount || 0,
          hasItems: !!result.items
        });
        
        const { first = 10, offset = 0 } = args;
        const hasNextPage = offset + first < result.totalCount;
        const hasPreviousPage = offset > 0;
        
        const response = {
          nodes: result.items || [],
          totalCount: result.totalCount || 0,
          hasNextPage,
          hasPreviousPage
        };
        
        console.log('✅ getMyOrders response:', {
          nodesCount: response.nodes.length,
          totalCount: response.totalCount,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage
        });
        
        return response;
      } catch (error) {
        console.error('❌ Error in getMyOrders:', error);
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    },

    getMyOrder: async (parent, args, context, info) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        console.log('🔍 getMyOrder - orderNumber:', args.orderNumber);
        console.log('🔍 getMyOrder - userId:', context.user.id);

        const order = await context.db.orders.getByOrderNumber(args.orderNumber);
        
        if (!order) {
          console.log('❌ Order not found:', args.orderNumber);
          throw new Error("Order not found");
        }

        console.log('📦 Order found:', order.orderNumber);
        console.log('🔍 Order userId:', order.userId);
        console.log('🔍 Current user:', context.user.id);

        // Convert ObjectId to string for comparison
        let orderUserId;
        if (typeof order.userId === 'object' && order.userId._id) {
          // If userId is populated user object
          orderUserId = order.userId._id.toString();
        } else {
          // If userId is ObjectId
          orderUserId = order.userId.toString();
        }

        if (orderUserId !== context.user.id) {
          console.log('❌ Access denied - order belongs to:', orderUserId, 'user is:', context.user.id);
          throw new Error("Access denied");
        }

        console.log('✅ Order access granted, returning order');
        return order;
      } catch (error) {
        console.error('❌ Error in getMyOrder:', error);
        console.error('❌ Full error stack:', error.stack);
        throw error;
      }
    },

    getAllOrders: async (parent, args, context, info) => {
      try {
        console.log('🔍 getAllOrders - args:', args);
        
        const result = await context.db.orders.getAll({
          first: args.first,
          offset: args.offset,
          orderBy: args.orderBy,
          condition: args.condition,
          search: args.search
        });
        
        // Filter out orders with invalid data
        const validOrders = (result.items || []).filter(order => {
          try {
            // Check if order has required fields
            if (!order._id || !order.orderNumber) {
              console.log('❌ Filtering out order with missing required fields:', order._id);
              return false;
            }
            
            // Check if paymentMethod is valid
            if (order.paymentMethod && !['cod', 'bank_transfer'].includes(order.paymentMethod)) {
              console.log('❌ Filtering out order with invalid paymentMethod:', order.paymentMethod);
              return false;
            }
            
            return true;
          } catch (error) {
            console.error('❌ Error filtering order:', error);
            return false;
          }
        });
        
        console.log(`🔍 getAllOrders - Total orders: ${result.items?.length || 0}, Valid orders: ${validOrders.length}`);
        
        const { first = 10, offset = 0 } = args;
        const hasNextPage = offset + first < result.totalCount;
        const hasPreviousPage = offset > 0;
        
        return {
          nodes: validOrders,
          totalCount: result.totalCount || 0,
          hasNextPage,
          hasPreviousPage
        };
      } catch (error) {
        console.error('❌ Error in getAllOrders:', error);
        // Return empty result instead of throwing error
        return {
          nodes: [],
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        };
      }
    },

    getOrder: async (parent, args, context, info) => {
      try {
        console.log('🔍 getOrder - orderNumber:', args.orderNumber);
        return await context.db.orders.getByOrderNumber(args.orderNumber);
      } catch (error) {
        console.error('❌ Error in getOrder:', error);
        throw new Error(`Failed to fetch order: ${error.message}`);
      }
    },

    getOrderStats: async (parent, args, context, info) => {
      try {
        console.log('🔍 getOrderStats called');
        return await context.db.orders.getStats();
      } catch (error) {
        console.error('❌ Error in getOrderStats:', error);
        throw new Error(`Failed to fetch order stats: ${error.message}`);
      }
    }
  },

  Mutation: {
    createOrderFromCart: async (parent, args, context, info) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        console.log('🔍 createOrderFromCart - userId:', context.user.id);
        console.log('🔍 createOrderFromCart - input:', JSON.stringify(args.input, null, 2));

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
        
        console.log('✅ Order created successfully:', order.orderNumber);
        
        return order;
      } catch (error) {
        console.error('❌ Error creating order:', error);
        throw error;
      }
    },

    updateOrderStatus: async (parent, args, context, info) => {
      try {
        console.log('🔍 updateOrderStatus:', args);
        
        const order = await context.db.orders.updateStatus(
          args.orderNumber, 
          args.status, 
          args.adminNotes
        );
        
        if (!order) {
          throw new Error('Order not found');
        }
        
        return order;
      } catch (error) {
        console.error('❌ Error updating order status:', error);
        throw error;
      }
    },

    updatePaymentStatus: async (parent, args, context, info) => {
      try {
        console.log('🔍 updatePaymentStatus:', args);
        
        const order = await context.db.orders.updatePaymentStatus(
          args.orderNumber, 
          args.paymentStatus
        );
        
        if (!order) {
          throw new Error('Order not found');
        }
        
        return order;
      } catch (error) {
        console.error('❌ Error updating payment status:', error);
        throw error;
      }
    },

    // ✅ FIXED: Properly formatted cancelOrder resolver
    cancelOrder: async (parent, args, context, info) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        console.log('🔍 cancelOrder - orderNumber:', args.orderNumber);
        console.log('🔍 cancelOrder - user:', context.user.username, '- role:', context.user.role);

        // Get the order first to check ownership and status
        const order = await context.db.orders.getByOrderNumber(args.orderNumber);
        
        if (!order) {
          throw new Error('Order not found');
        }

        // Check ownership for customers
        if (context.user.role === 'customer') {
          // Convert ObjectId to string for comparison
          let orderUserId;
          if (typeof order.userId === 'object' && order.userId._id) {
            orderUserId = order.userId._id.toString();
          } else {
            orderUserId = order.userId.toString();
          }

          if (orderUserId !== context.user.id) {
            throw new Error('You can only cancel your own orders');
          }

          // Check if order can be cancelled (only pending or confirmed)
          if (!['pending', 'confirmed'].includes(order.status)) {
            throw new Error('This order cannot be cancelled anymore');
          }
        }

        // Admin and Manager can cancel any order
        console.log('✅ Order cancellation authorized');
        
        // Cancel the order
        const cancelledOrder = await context.db.orders.cancel(
          args.orderNumber, 
          args.reason || (context.user.role === 'customer' ? 'Khách hàng yêu cầu hủy đơn' : args.reason)
        );
        
        if (!cancelledOrder) {
          throw new Error('Failed to cancel order');
        }
        
        console.log('✅ Order cancelled successfully:', args.orderNumber);
        return cancelledOrder;
      } catch (error) {
        console.error('❌ Error cancelling order:', error);
        throw error;
      }
    },

    fixInvalidOrders: async (parent, args, context, info) => {
      try {
        if (!context.user || context.user.role !== 'admin') {
          throw new Error("Admin access required");
        }

        console.log('🔧 Fixing invalid orders...');
        
        // Get all orders
        const allOrders = await context.db.orders.getAll({ first: 1000, offset: 0 });
        let fixedCount = 0;
        
        for (const order of allOrders.items) {
          let needsUpdate = false;
          const updateData = {};
          
          // Fix paymentMethod
          if (!order.paymentMethod || !['cod', 'bank_transfer'].includes(order.paymentMethod)) {
            updateData.paymentMethod = 'cod';
            needsUpdate = true;
            console.log(`🔧 Fixing paymentMethod for order ${order.orderNumber}: ${order.paymentMethod} -> cod`);
          }
          
          // Fix paymentStatus
          if (!order.paymentStatus || !['pending', 'paid', 'failed', 'refunded'].includes(order.paymentStatus)) {
            updateData.paymentStatus = 'pending';
            needsUpdate = true;
            console.log(`🔧 Fixing paymentStatus for order ${order.orderNumber}: ${order.paymentStatus} -> pending`);
          }
          
          // Fix status
          if (!order.status || !['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'].includes(order.status)) {
            updateData.status = 'pending';
            needsUpdate = true;
            console.log(`🔧 Fixing status for order ${order.orderNumber}: ${order.status} -> pending`);
          }
          
          // Fix customerInfo if missing
          if (!order.customerInfo) {
            updateData.customerInfo = {
              fullName: 'Unknown Customer',
              phone: 'N/A',
              address: 'N/A',
              city: 'N/A',
              notes: ''
            };
            needsUpdate = true;
            console.log(`🔧 Fixing customerInfo for order ${order.orderNumber}`);
          }
          
          if (needsUpdate) {
            await context.db.orders.updateById(order._id, updateData);
            fixedCount++;
            console.log(`🔧 Fixed order ${order.orderNumber}`);
          }
        }
        
        console.log(`✅ Fixed ${fixedCount} invalid orders`);
        return true;
      } catch (error) {
        console.error('❌ Error fixing invalid orders:', error);
        throw error;
      }
    },

    clearAllOrders: async (parent, args, context, info) => {
      try {
        if (!context.user || context.user.role !== 'admin') {
          throw new Error("Admin access required");
        }

        console.log('🗑️ Clearing all orders and order items...');
        
        // Delete all order items first (to maintain referential integrity)
        const orderItemsResult = await context.db.orderItems.deleteAll();
        console.log(`🗑️ Deleted ${orderItemsResult.deletedCount || 0} order items`);
        
        // Delete all orders
        const ordersResult = await context.db.orders.deleteAll();
        console.log(`🗑️ Deleted ${ordersResult.deletedCount || 0} orders`);
        
        console.log('✅ All orders and order items cleared successfully');
        return true;
      } catch (error) {
        console.error('❌ Error clearing all orders:', error);
        throw error;
      }
    }
  }
};