// File: server/data/models/product.js - UPDATED with Review fields
import mongoose from "mongoose";

let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;

export const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: Number,
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    images: [String],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    
    // ============= NEW REVIEW FIELDS =============
    // Average rating from reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: function(val) {
        return Math.round(val * 10) / 10; // Round to 1 decimal place
      }
    },
    
    // Total number of reviews
    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Rating distribution for detailed stats
    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  {
    collection: "products",
    timestamps: true,
  }
);

// Existing indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stock: 1 });

// NEW: Indexes for review functionality
ProductSchema.index({ averageRating: -1 }); // Sort by rating
ProductSchema.index({ totalReviews: -1 }); // Sort by review count
ProductSchema.index({ averageRating: -1, totalReviews: -1 }); // Compound sort

// Virtual for star rating display
ProductSchema.virtual('starRating').get(function() {
  return {
    full: Math.floor(this.averageRating),
    half: this.averageRating % 1 >= 0.5 ? 1 : 0,
    empty: 5 - Math.floor(this.averageRating) - (this.averageRating % 1 >= 0.5 ? 1 : 0)
  };
});

// Virtual for review statistics
ProductSchema.virtual('reviewStats').get(function() {
  if (this.totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const percentages = {};
  for (let i = 1; i <= 5; i++) {
    percentages[i] = Math.round((this.ratingDistribution[i] / this.totalReviews) * 100);
  }

  return {
    averageRating: this.averageRating,
    totalReviews: this.totalReviews,
    distribution: this.ratingDistribution,
    percentages: percentages
  };
});

// Method to check if product can be reviewed by user
ProductSchema.methods.canBeReviewedBy = async function(userId) {
  const Order = mongoose.model('Order');
  const OrderItem = mongoose.model('OrderItem');
  const Review = mongoose.model('Review');
  
  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    userId: userId,
    productId: this._id
  });
  
  if (existingReview) {
    return { canReview: false, reason: 'already_reviewed' };
  }
  
  // Check if user bought this product in a delivered order
  const deliveredOrders = await Order.find({
    userId: userId,
    status: 'delivered',
    paymentStatus: 'paid'
  });
  
  if (deliveredOrders.length === 0) {
    return { canReview: false, reason: 'not_purchased' };
  }
  
  // Check if any of these orders contains this product
  const orderIds = deliveredOrders.map(order => order._id);
  const orderItem = await OrderItem.findOne({
    orderId: { $in: orderIds },
    productId: this._id
  });
  
  if (!orderItem) {
    return { canReview: false, reason: 'not_purchased' };
  }
  
  return { 
    canReview: true, 
    orderId: orderItem.orderId,
    orderItemId: orderItem._id 
  };
};