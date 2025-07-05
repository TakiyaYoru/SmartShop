// File: webfrontend/src/graphql/reviews.js - Frontend GraphQL for Reviews (NO JSX)

import { gql } from '@apollo/client';

// Fragments
export const REVIEW_FRAGMENT = gql`
  fragment ReviewData on Review {
    _id
    userId
    user {
      _id
      username
      firstName
      lastName
    }
    productId
    product {
      _id
      name
      images
    }
    orderId
    order {
      _id
      orderNumber
      orderDate
    }
    orderItemId
    rating
    comment
    images
    adminResponse {
      responseText
      respondedBy {
        _id
        username
        firstName
        lastName
      }
      respondedAt
    }
    isVerified
    helpfulVotes
    status
    createdAt
    updatedAt
  }
`;

export const REVIEW_STATS_FRAGMENT = gql`
  fragment ReviewStatsData on ReviewStatsInfo {
    averageRating
    totalReviews
    distribution {
      _1
      _2
      _3
      _4
      _5
    }
    percentages {
      _1
      _2
      _3
      _4
      _5
    }
  }
`;

// ============= CUSTOMER QUERIES =============

// Get reviews for a product (public - no auth required)
export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews(
    $productId: ID!,
    $first: Int = 10,
    $offset: Int = 0,
    $orderBy: ReviewsOrderBy = CREATED_DESC,
    $ratingFilter: Int
  ) {
    getProductReviews(
      productId: $productId,
      first: $first,
      offset: $offset,
      orderBy: $orderBy,
      ratingFilter: $ratingFilter
    ) {
      nodes {
        ...ReviewData
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
  ${REVIEW_FRAGMENT}
`;

// Get current user's reviews
export const GET_MY_REVIEWS = gql`
  query GetMyReviews(
    $first: Int = 10,
    $offset: Int = 0,
    $orderBy: ReviewsOrderBy = CREATED_DESC
  ) {
    getMyReviews(
      first: $first,
      offset: $offset,
      orderBy: $orderBy
    ) {
      nodes {
        ...ReviewData
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
  ${REVIEW_FRAGMENT}
`;

// Get single review by ID
export const GET_REVIEW = gql`
  query GetReview($reviewId: ID!) {
    getReview(reviewId: $reviewId) {
      ...ReviewData
    }
  }
  ${REVIEW_FRAGMENT}
`;

// Check if user can review a product
export const CAN_REVIEW_PRODUCT = gql`
  query CanReviewProduct($productId: ID!) {
    canReviewProduct(productId: $productId) {
      canReview
      reason
      orderId
      orderItemId
    }
  }
`;

// ============= ADMIN QUERIES =============

// Get all reviews for admin dashboard
export const GET_ALL_REVIEWS_ADMIN = gql`
  query GetAllReviewsAdmin(
    $first: Int = 10,
    $offset: Int = 0,
    $orderBy: ReviewsOrderBy = CREATED_DESC,
    $condition: ReviewConditionInput
  ) {
    getAllReviews(
      first: $first,
      offset: $offset,
      orderBy: $orderBy,
      condition: $condition
    ) {
      nodes {
        ...ReviewData
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
  ${REVIEW_FRAGMENT}
`;

// Get review statistics for admin dashboard
export const GET_REVIEW_STATS = gql`
  query GetReviewStats {
    getReviewStats {
      totalReviews
      activeReviews
      hiddenReviews
      flaggedReviews
      averageRating
      recentReviews
    }
  }
`;

// ============= MUTATIONS =============

// Create a new review
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ...ReviewData
    }
  }
  ${REVIEW_FRAGMENT}
`;

// Admin: Add response to review
export const ADD_ADMIN_RESPONSE = gql`
  mutation AddAdminResponse($input: AdminResponseInput!) {
    addAdminResponse(input: $input) {
      ...ReviewData
    }
  }
  ${REVIEW_FRAGMENT}
`;

// Admin: Remove response from review
export const REMOVE_ADMIN_RESPONSE = gql`
  mutation RemoveAdminResponse($reviewId: ID!) {
    removeAdminResponse(reviewId: $reviewId) {
      ...ReviewData
    }
  }
  ${REVIEW_FRAGMENT}
`;

// Admin: Update review status
export const UPDATE_REVIEW_STATUS = gql`
  mutation UpdateReviewStatus($reviewId: ID!, $status: ReviewStatus!) {
    updateReviewStatus(reviewId: $reviewId, status: $status) {
      ...ReviewData
    }
  }
  ${REVIEW_FRAGMENT}
`;

// Mark review as helpful
export const MARK_REVIEW_HELPFUL = gql`
  mutation MarkReviewHelpful($reviewId: ID!) {
    markReviewHelpful(reviewId: $reviewId) {
      _id
      helpfulVotes
    }
  }
`;

// ============= HELPER CONSTANTS =============

// Review status options for forms
export const REVIEW_STATUS_OPTIONS = [
  { value: 'active', label: 'Hiển thị', color: 'green' },
  { value: 'hidden', label: 'Ẩn', color: 'gray' },
  { value: 'flagged', label: 'Đánh dấu', color: 'red' }
];

// Review order by options
export const REVIEW_ORDER_OPTIONS = [
  { value: 'CREATED_DESC', label: 'Mới nhất' },
  { value: 'CREATED_ASC', label: 'Cũ nhất' },
  { value: 'RATING_DESC', label: 'Rating cao nhất' },
  { value: 'RATING_ASC', label: 'Rating thấp nhất' },
  { value: 'HELPFUL_DESC', label: 'Hữu ích nhất' }
];

// Rating options for filter
export const RATING_FILTER_OPTIONS = [
  { value: null, label: 'Tất cả đánh giá' },
  { value: 5, label: '⭐⭐⭐⭐⭐ (5 sao)' },
  { value: 4, label: '⭐⭐⭐⭐ (4 sao)' },
  { value: 3, label: '⭐⭐⭐ (3 sao)' },
  { value: 2, label: '⭐⭐ (2 sao)' },
  { value: 1, label: '⭐ (1 sao)' }
];

// ============= HELPER FUNCTIONS =============

export const getReviewStatusInfo = (status) => {
  return REVIEW_STATUS_OPTIONS.find(option => option.value === status) || 
         { value: status, label: status, color: 'gray' };
};

export const formatReviewDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  
  return date.toLocaleDateString('vi-VN');
};

export const calculateRatingPercentage = (count, total) => {
  return total > 0 ? Math.round((count / total) * 100) : 0;
};