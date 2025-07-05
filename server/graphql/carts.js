export const typeDef = `
  type CartItem {
    _id: ID!
    userId: ID!
    product: Product
    quantity: Int!
    unitPrice: Float!
    productName: String!
    totalPrice: Float!
    addedAt: String!
  }

  type CartSummary {
    items: [CartItem!]!
    totalItems: Int!
    subtotal: Float!
  }

  input AddToCartInput {
    productId: ID!
    quantity: Int! = 1
  }

  input UpdateCartInput {
    productId: ID!
    quantity: Int!
  }

  extend type Query {
    getCart: CartSummary!
    getCartItemCount: Int!
  }

  extend type Mutation {
    addToCart(input: AddToCartInput!): CartItem!
    updateCartItem(input: UpdateCartInput!): CartItem!
    removeFromCart(productId: ID!): Boolean!
    clearCart: Boolean!
    cleanInvalidCartItems: Boolean!
  }
`;

export const resolvers = {
  CartItem: {
    // Resolver để tính totalPrice
    totalPrice: (parent) => {
      return parent.quantity * parent.unitPrice;
    },
    
    // Populate product information - FIXED: Handle null product gracefully
    product: async (parent, args, context) => {
      const product = await context.db.products.findById(parent.productId);
      if (!product) {
        // Return a placeholder product object instead of null
        return {
          _id: parent.productId,
          name: parent.productName || 'Product no longer available',
          price: parent.unitPrice,
          stock: 0,
          isActive: false,
          description: 'This product has been removed from our catalog',
          images: [],
          sku: 'N/A',
          category: null,
          brand: null
        };
      }
      return product;
    }
  },

  Query: {
    getCart: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      console.log('Getting cart for user:', context.user.id);
      
      const cartItems = await context.db.carts.getByUserId(context.user.id);
      
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

      return {
        items: cartItems,
        totalItems,
        subtotal
      };
    },

    getCartItemCount: async (parent, args, context, info) => {
      if (!context.user) {
        return 0;
      }

      const cartItems = await context.db.carts.getByUserId(context.user.id);
      return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }
  },

  Mutation: {
    addToCart: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const { productId, quantity } = args.input;

      console.log('Adding to cart:', { userId: context.user.id, productId, quantity });

      // Kiểm tra product có tồn tại không
      const product = await context.db.products.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Kiểm tra stock
      if (product.stock < quantity) {
        throw new Error(`Only ${product.stock} items available in stock`);
      }

      // Kiểm tra product đã có trong cart chưa
      const existingCartItem = await context.db.carts.findByUserAndProduct(context.user.id, productId);

      if (existingCartItem) {
        // Nếu đã có, cập nhật quantity
        const newQuantity = existingCartItem.quantity + quantity;
        
        // Kiểm tra stock cho quantity mới
        if (product.stock < newQuantity) {
          throw new Error(`Cannot add ${quantity} more. Only ${product.stock - existingCartItem.quantity} items available`);
        }

        return await context.db.carts.updateQuantity(context.user.id, productId, newQuantity);
      } else {
        // Nếu chưa có, tạo mới
        const cartData = {
          userId: context.user.id,
          productId: productId,
          quantity: quantity,
          unitPrice: product.price,
          productName: product.name
        };

        return await context.db.carts.create(cartData);
      }
    },

    updateCartItem: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const { productId, quantity } = args.input;

      console.log('Updating cart item:', { userId: context.user.id, productId, quantity });

      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      // Kiểm tra product có tồn tại không
      const product = await context.db.products.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Kiểm tra stock
      if (product.stock < quantity) {
        throw new Error(`Only ${product.stock} items available in stock`);
      }

      // Kiểm tra cart item có tồn tại không
      const existingCartItem = await context.db.carts.findByUserAndProduct(context.user.id, productId);
      if (!existingCartItem) {
        throw new Error("Item not found in cart");
      }

      return await context.db.carts.updateQuantity(context.user.id, productId, quantity);
    },

    removeFromCart: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      console.log('Removing from cart:', { userId: context.user.id, productId: args.productId });

      const result = await context.db.carts.removeItem(context.user.id, args.productId);
      return result;
    },

    clearCart: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      console.log('Clearing cart for user:', context.user.id);

      const result = await context.db.carts.clearByUserId(context.user.id);
      return result;
    },

    cleanInvalidCartItems: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      console.log('Cleaning invalid cart items for user:', context.user.id);

      // Get all cart items for user
      const cartItems = await context.db.carts.getByUserId(context.user.id);
      const invalidItems = [];

      for (const item of cartItems) {
        const product = await context.db.products.findById(item.productId);
        if (!product || !product.isActive) {
          invalidItems.push(item._id);
        }
      }

      if (invalidItems.length > 0) {
        await context.db.carts.removeItemsByIds(invalidItems);
        console.log(`🧹 Cleaned ${invalidItems.length} invalid cart items`);
      }

      return true;
    }
  }
};