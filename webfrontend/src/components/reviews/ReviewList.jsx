// File: webfrontend/src/components/reviews/ReviewList.jsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  ChevronDownIcon,
  FunnelIcon,
  StarIcon
} from '@heroicons/react/24/outline';

import ReviewCard from './ReviewCard';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { 
  GET_PRODUCT_REVIEWS, 
  RATING_FILTER_OPTIONS,
  REVIEW_ORDER_OPTIONS,
  calculateRatingPercentage
} from '../../graphql/reviews';
import { renderStarRating } from '../../utils/reviewHelper';

const ReviewList = ({ productId, productReviewStats = null, isAdmin = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState('CREATED_DESC');
  const [ratingFilter, setRatingFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCT_REVIEWS, {
    variables: {
      productId,
      first: itemsPerPage,
      offset: 0,
      orderBy,
      ratingFilter
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  const handleFilterChange = (newRatingFilter, newOrderBy) => {
    setRatingFilter(newRatingFilter);
    setOrderBy(newOrderBy || orderBy);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (data?.getProductReviews?.hasNextPage) {
      fetchMore({
        variables: {
          offset: data.getProductReviews.nodes.length
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          
          return {
            getProductReviews: {
              ...fetchMoreResult.getProductReviews,
              nodes: [
                ...prev.getProductReviews.nodes,
                ...fetchMoreResult.getProductReviews.nodes
              ]
            }
          };
        }
      });
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="review-card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Không thể tải đánh giá. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const reviews = data?.getProductReviews?.nodes || [];
  const totalCount = data?.getProductReviews?.totalCount || 0;
  const hasNextPage = data?.getProductReviews?.hasNextPage || false;

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      {productReviewStats && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {productReviewStats.averageRating.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    {renderStarRating(productReviewStats.averageRating, 'lg')}
                  </div>
                  <p className="text-sm text-gray-600">
                    {productReviewStats.totalReviews} đánh giá
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = productReviewStats.distribution[`_${rating}`] || 0;
                const percentage = calculateRatingPercentage(count, productReviewStats.totalReviews);
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <button
                      onClick={() => handleFilterChange(rating, orderBy)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <span>{rating}</span>
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    </button>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {percentage}%
                    </span>
                    <span className="text-sm text-gray-500 w-8 text-right">
                      ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Đánh giá ({totalCount})
          </h3>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Lọc & Sắp xếp</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo số sao
                </label>
                <select
                  value={ratingFilter || ''}
                  onChange={(e) => handleFilterChange(e.target.value ? parseInt(e.target.value) : null, orderBy)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {RATING_FILTER_OPTIONS.map((option) => (
                    <option key={option.value || 'all'} value={option.value || ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <select
                  value={orderBy}
                  onChange={(e) => handleFilterChange(ratingFilter, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {REVIEW_ORDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(ratingFilter || orderBy !== 'CREATED_DESC') && (
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                {ratingFilter && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {ratingFilter} sao
                    <button
                      onClick={() => handleFilterChange(null, orderBy)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => handleFilterChange(null, 'CREATED_DESC')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {ratingFilter ? `Chưa có đánh giá ${ratingFilter} sao` : 'Chưa có đánh giá nào'}
          </h3>
          <p className="text-gray-500">
            {ratingFilter ? 
              'Hãy thử lọc theo số sao khác hoặc xóa bộ lọc.' :
              'Hãy là người đầu tiên đánh giá sản phẩm này.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              showProductInfo={false}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasNextPage && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang tải...' : 'Xem thêm đánh giá'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;