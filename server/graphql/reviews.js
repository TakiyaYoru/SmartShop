// File: server/graphql/reviews.js - FIXED COMPLETE VERSION

import mongoose from "mongoose";

export const typeDef = `
  type Review {
    _id: ID!
    userId: ID!
    user: UserInfo
    productId: ID!
    product: Product
    orderId: ID!
    order: OrderInfo
    orderItemId: ID!
    rating: Int!
    comment: String!
    images: [String!]!
    adminResponse: AdminResponse
    isVerified: Boolean!
    helpfulVotes: Int!
    status: ReviewStatus!
    createdAt: String!
    updatedAt: String!
  }

  type AdminResponse {
    responseText: String!
    respondedBy: UserInfo
    respondedAt: String
  }

  type OrderInfo {
    _id: ID!
    orderNumber: String!
    orderDate: String!
  }

  type UserInfo {
    _id: ID!
    username: String!
    firstName: String
    lastName: String
    email: String
  }

  enum ReviewStatus {
    active
    hidden
    flagged
  }

  enum ReviewsOrderBy {
    CREATED_ASC
    CREATED_DESC
    RATING_ASC
    RATING_DESC
    HELPFUL_ASC
    HELPFUL_DESC
  }

  type ReviewConnection {
    nodes: [Review!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type ReviewStats {
    totalReviews: Int!
    activeReviews: Int!
    hiddenReviews: Int!
    flaggedReviews: Int!
    averageRating: Float!
    recentReviews: Int!
  }

  type ReviewEligibility {
    canReview: Boolean!
    reason: String
    orderId: ID
    orderItemId: ID
  }

  input CreateReviewInput {
    productId: ID!
    orderId: ID!
    orderItemId: ID!
    rating: Int!
    comment: String!
    images: [String!]
  }

  input AdminResponseInput {
    reviewId: ID!
    responseText: String!
  }

  input ReviewConditionInput {
    productId: ID
    userId: ID
    status: ReviewStatus
    ratingFilter: Int
    dateFrom: String
    dateTo: String
  }

  type RatingDistribution {
    _1: Int!
    _2: Int!
    _3: Int!
    _4: Int!
    _5: Int!
  }

  type ReviewStatsInfo {
    averageRating: Float!
    totalReviews: Int!
    distribution: RatingDistribution!
    percentages: RatingPercentages!
  }

  type RatingPercentages {
    _1: Int!
    _2: Int!
    _3: Int!
    _4: Int!
    _5: Int!
  }

  extend type Product {
    reviews(
      first: Int = 10,
      offset: Int = 0,
      orderBy: ReviewsOrderBy = CREATED_DESC,
      ratingFilter: Int
    ): ReviewConnection
    
    averageRating: Float!
    totalReviews: Int!
    ratingDistribution: RatingDistribution!
    reviewStats: ReviewStatsInfo!
  }

  extend type Query {
    getProductReviews(
      productId: ID!,
      first: Int = 10,
      offset: Int = 0,
      orderBy: ReviewsOrderBy = CREATED_DESC,
      ratingFilter: Int
    ): ReviewConnection

    getMyReviews(
      first: Int = 10,
      offset: Int = 0,
      orderBy: ReviewsOrderBy = CREATED_DESC
    ): ReviewConnection

    getReview(reviewId: ID!): Review

    canReviewProduct(productId: ID!): ReviewEligibility!

    getAllReviews(
      first: Int = 10,
      offset: Int = 0,
      orderBy: ReviewsOrderBy = CREATED_DESC,
      condition: ReviewConditionInput
    ): ReviewConnection

    getReviewStats: ReviewStats!
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    addAdminResponse(input: AdminResponseInput!): Review!
    removeAdminResponse(reviewId: ID!): Review!
    updateReviewStatus(reviewId: ID!, status: ReviewStatus!): Review!
    markReviewHelpful(reviewId: ID!): Review!
  }
`;

export const resolvers = {
  // FIX: Properly handle ObjectId to String conversion
  Review: {
    userId: (parent) => {
      return parent.userId ? parent.userId.toString() : null;
    },

    user: async (parent, args, context) => {
      try {
        if (!parent.userId) return null;
        return await context.db.users.findById(parent.userId);
      } catch (error) {
        console.error('Error resolving Review.user:', error);
        return null;
      }
    },

    productId: (parent) => {
      return parent.productId ? parent.productId.toString() : null;
    },

    product: async (parent, args, context) => {
      try {
        if (!parent.productId) return null;
        return await context.db.products.findById(parent.productId);
      } catch (error) {
        console.error('Error resolving Review.product:', error);
        return null;
      }
    },

    orderId: (parent) => {
      return parent.orderId ? parent.orderId.toString() : null;
    },

    order: async (parent, args, context) => {
      try {
        if (!parent.orderId) return null;
        const order = await context.db.orders.findById(parent.orderId);
        return order ? {
          _id: order._id.toString(),
          orderNumber: order.orderNumber,
          orderDate: order.orderDate.toISOString()
        } : null;
      } catch (error) {
        console.error('Error resolving Review.order:', error);
        return null;
      }
    },

    orderItemId: (parent) => {
      return parent.orderItemId ? parent.orderItemId.toString() : null;
    },

    // FIX: Handle adminResponse properly
    adminResponse: (parent) => {
      if (!parent.adminResponse) return null;
      return {
        responseText: parent.adminResponse.responseText || '',
        respondedBy: parent.adminResponse.respondedBy,
        respondedAt: parent.adminResponse.respondedAt ? parent.adminResponse.respondedAt.toISOString() : null
      };
    },

    // FIX: Ensure arrays are properly handled
    images: (parent) => {
      return Array.isArray(parent.images) ? parent.images : [];
    },

    // FIX: Handle date conversion
    createdAt: (parent) => {
      return parent.createdAt ? parent.createdAt.toISOString() : null;
    },

    updatedAt: (parent) => {
      return parent.updatedAt ? parent.updatedAt.toISOString() : null;
    }
  },

  AdminResponse: {
    respondedBy: async (parent, args, context) => {
      try {
        if (!parent.respondedBy) return null;
        return await context.db.users.findById(parent.respondedBy);
      } catch (error) {
        console.error('Error resolving AdminResponse.respondedBy:', error);
        return null;
      }
    },

    respondedAt: (parent) => {
      return parent.respondedAt ? parent.respondedAt.toISOString() : null;
    }
  },

  // FIX: Extend Product type with review functionality
  Product: {
    reviews: async (parent, args, context) => {
      try {
        return await context.db.reviews.getByProductId(parent._id, args);
      } catch (error) {
        console.error('Error resolving Product.reviews:', error);
        return { nodes: [], totalCount: 0, hasNextPage: false, hasPreviousPage: false };
      }
    },

    averageRating: (parent) => {
      return parent.averageRating || 0;
    },

    totalReviews: (parent) => {
      return parent.totalReviews || 0;
    },

    ratingDistribution: (parent) => {
      const dist = parent.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      return {
        _1: dist[1] || 0,
        _2: dist[2] || 0,
        _3: dist[3] || 0,
        _4: dist[4] || 0,
        _5: dist[5] || 0
      };
    },

    reviewStats: (parent) => {
      const totalReviews = parent.totalReviews || 0;
      const averageRating = parent.averageRating || 0;
      const dist = parent.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      let percentages = { _1: 0, _2: 0, _3: 0, _4: 0, _5: 0 };
      if (totalReviews > 0) {
        for (let i = 1; i <= 5; i++) {
          percentages[`_${i}`] = Math.round((dist[i] / totalReviews) * 100);
        }
      }

      return {
        averageRating,
        totalReviews,
        distribution: {
          _1: dist[1] || 0,
          _2: dist[2] || 0,
          _3: dist[3] || 0,
          _4: dist[4] || 0,
          _5: dist[5] || 0
        },
        percentages
      };
    }
  },

  Query: {
    getProductReviews: async (parent, args, context) => {
      try {
        return await context.db.reviews.getByProductId(args.productId, args);
      } catch (error) {
        console.error('Error in getProductReviews:', error);
        return { nodes: [], totalCount: 0, hasNextPage: false, hasPreviousPage: false };
      }
    },

    getMyReviews: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }
        return await context.db.reviews.getByUserId(context.user.id, args);
      } catch (error) {
        console.error('Error in getMyReviews:', error);
        throw error;
      }
    },

    getReview: async (parent, args, context) => {
      try {
        return await context.db.reviews.findById(args.reviewId);
      } catch (error) {
        console.error('Error in getReview:', error);
        throw error;
      }
    },

    canReviewProduct: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }
        return await context.db.reviews.canUserReviewProduct(context.user.id, args.productId);
      } catch (error) {
        console.error('Error in canReviewProduct:', error);
        return { canReview: false, reason: 'error' };
      }
    },

    getAllReviews: async (parent, args, context) => {
      try {
        if (!context.user || !['admin', 'manager'].includes(context.user.role)) {
          throw new Error("Admin access required");
        }
        return await context.db.reviews.getAll(args);
      } catch (error) {
        console.error('Error in getAllReviews:', error);
        throw error;
      }
    },

    getReviewStats: async (parent, args, context) => {
      try {
        if (!context.user || !['admin', 'manager'].includes(context.user.role)) {
          throw new Error("Admin access required");
        }
        return await context.db.reviews.getStats();
      } catch (error) {
        console.error('Error in getReviewStats:', error);
        throw error;
      }
    }
  },

  Mutation: {
    createReview: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        const { productId, orderId, orderItemId, rating, comment, images } = args.input;

        console.log('Creating review:', { userId: context.user.id, productId, rating });

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
          throw new Error("Rating must be between 1 and 5");
        }

        // Validate comment
        if (!comment || comment.trim().length < 10) {
          throw new Error("Comment must be at least 10 characters long");
        }

        // Check if user can review this product
        const eligibility = await context.db.reviews.canUserReviewProduct(context.user.id, productId);
        if (!eligibility.canReview) {
          const messages = {
            already_reviewed: "You have already reviewed this product",
            not_purchased: "You can only review products you have purchased and received"
          };
          throw new Error(messages[eligibility.reason] || "Cannot review this product");
        }

        // Create review data
        const reviewData = {
          userId: context.user.id,
          productId,
          orderId,
          orderItemId,
          rating: parseInt(rating),
          comment: comment.trim(),
          images: images || [],
          isVerified: true,
          status: 'active'
        };

        return await context.db.reviews.create(reviewData);
      } catch (error) {
        console.error('Error in createReview:', error);
        throw error;
      }
    },

    addAdminResponse: async (parent, args, context) => {
      try {
        if (!context.user || !['admin', 'manager'].includes(context.user.role)) {
          throw new Error("Admin access required");
        }

        const { reviewId, responseText } = args.input;

        if (!responseText || responseText.trim().length < 1) {
          throw new Error("Response text is required");
        }

        return await context.db.reviews.updateAdminResponse(reviewId, {
          responseText: responseText.trim(),
          respondedBy: context.user.id
        });
      } catch (error) {
        console.error('Error in addAdminResponse:', error);
        throw error;
      }
    },

    removeAdminResponse: async (parent, args, context) => {
      try {
        if (!context.user || !['admin', 'manager'].includes(context.user.role)) {
          throw new Error("Admin access required");
        }

        return await context.db.reviews.removeAdminResponse(args.reviewId);
      } catch (error) {
        console.error('Error in removeAdminResponse:', error);
        throw error;
      }
    },

    updateReviewStatus: async (parent, args, context) => {
      try {
        if (!context.user || !['admin', 'manager'].includes(context.user.role)) {
          throw new Error("Admin access required");
        }

        return await context.db.reviews.updateStatus(args.reviewId, args.status);
      } catch (error) {
        console.error('Error in updateReviewStatus:', error);
        throw error;
      }
    },

    markReviewHelpful: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        return await context.db.reviews.incrementHelpfulVotes(args.reviewId);
      } catch (error) {
        console.error('Error in markReviewHelpful:', error);
        throw error;
      }
    }
  }
};