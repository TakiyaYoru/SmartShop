// File: server/data/models/review.js
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ReviewSchema = new Schema(
  {
    // Liên kết với user đã mua
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Liên kết với product được review
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Liên kết với order đã hoàn thành (để verify đã mua)
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    // Liên kết với orderItem cụ thể
    orderItemId: {
      type: Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true,
    },
    
    // Review content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5'
      }
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000
    },
    // Hình ảnh review (lưu URLs từ Firebase Storage)
    images: [{
      type: String,
      validate: {
        validator: function(v) {
          return /^https:\/\//.test(v); // Phải là HTTPS URL
        },
        message: 'Image must be a valid HTTPS URL'
      }
    }],
    
    // Admin response
    adminResponse: {
      responseText: {
        type: String,
        trim: true,
        maxlength: 500
      },
      respondedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Admin user
      },
      respondedAt: {
        type: Date
      }
    },
    
    // Verification status
    isVerified: {
      type: Boolean,
      default: true // Auto-verify since user bought the product
    },
    
    // Helpful votes (for future feature)
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Metadata
    status: {
      type: String,
      enum: ['active', 'hidden', 'flagged'],
      default: 'active'
    }
  },
  {
    collection: "reviews",
    timestamps: true, // createdAt, updatedAt
  }
);

// Indexes for performance
ReviewSchema.index({ productId: 1, createdAt: -1 }); // Query reviews by product
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // One review per user per product
ReviewSchema.index({ orderId: 1 }); // Query reviews by order
ReviewSchema.index({ rating: 1 }); // Filter by rating
ReviewSchema.index({ isVerified: 1, status: 1 }); // Public reviews
ReviewSchema.index({ createdAt: -1 }); // Latest reviews
ReviewSchema.index({ helpfulVotes: -1 }); // Most helpful reviews

// Virtual for calculating average rating (will be done at Product level)
ReviewSchema.virtual('isEditable').get(function() {
  // Reviews cannot be edited once submitted
  return false;
});

// Pre-save validation
ReviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Verify user actually bought this product in this order
    const OrderItem = mongoose.model('OrderItem');
    const Order = mongoose.model('Order');
    
    const order = await Order.findById(this.orderId);
    if (!order || order.status !== 'delivered' || order.paymentStatus !== 'paid') {
      throw new Error('Can only review products from delivered and paid orders');
    }
    
    if (order.userId.toString() !== this.userId.toString()) {
      throw new Error('Can only review your own purchases');
    }
    
    const orderItem = await OrderItem.findById(this.orderItemId);
    if (!orderItem || orderItem.orderId.toString() !== this.orderId.toString()) {
      throw new Error('Invalid order item');
    }
    
    if (orderItem.productId.toString() !== this.productId.toString()) {
      throw new Error('Product ID mismatch');
    }
  }
  
  next();
});

// Post-save hook to update product rating
ReviewSchema.post('save', async function() {
  await updateProductRating(this.productId);
});

ReviewSchema.post('remove', async function() {
  await updateProductRating(this.productId);
});

// Helper function to update product average rating
async function updateProductRating(productId) {
  const Review = mongoose.model('Review');
  const Product = mongoose.model('Product');
  
  const stats = await Review.aggregate([
    { 
      $match: { 
        productId: productId, 
        status: 'active',
        isVerified: true 
      } 
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
  
  if (stats.length > 0) {
    const { averageRating, totalReviews } = stats[0];
    
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach(rating => {
      distribution[rating]++;
    });
    
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: totalReviews,
      ratingDistribution: distribution
    });
  } else {
    // No reviews, reset to default
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
  }
}