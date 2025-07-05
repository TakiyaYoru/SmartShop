// File: webfrontend/src/components/reviews/ReviewCard.jsx - FIXED VERSION
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import {
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid } from '@heroicons/react/24/solid';

import { MARK_REVIEW_HELPFUL, formatReviewDate } from '../../graphql/reviews';
import { renderStarRating } from '../../utils/reviewHelper';
import { SmartImage } from '../../utils/imageHelper';

const ReviewCard = ({ review, showProductInfo = false, isAdmin = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const [markHelpful, { loading: markingHelpful }] = useMutation(MARK_REVIEW_HELPFUL, {
    onCompleted: () => {
      toast.success('Cảm ơn bạn đã đánh giá!');
      setHasVoted(true);
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  });

  const handleMarkHelpful = () => {
    if (!hasVoted) {
      markHelpful({ variables: { reviewId: review._id } });
    }
  };

  const truncateComment = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {review.user?.firstName?.[0] || review.user?.username?.[0] || 'U'}
          </div>
          
          {/* User Info & Rating */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900">
                {review.user?.firstName ? 
                  `${review.user.firstName} ${review.user.lastName || ''}`.trim() : 
                  review.user?.username || 'Người dùng'
                }
              </span>
              {review.isVerified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  ✓ Đã mua hàng
                </span>
              )}
            </div>
            
            {/* Rating Stars */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {renderStarRating(review.rating, 'sm')}
              </div>
              <span className="text-sm text-gray-500">
                {formatReviewDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              review.status === 'active' ? 'bg-green-100 text-green-800' :
              review.status === 'hidden' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {review.status === 'active' ? 'Hiển thị' :
               review.status === 'hidden' ? 'Ẩn' : 'Đánh dấu'}
            </span>
          </div>
        )}
      </div>

      {/* Product Info (if needed) */}
      {showProductInfo && review.product && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
            {review.product.images?.[0] ? (
              <SmartImage
                src={review.product.images[0]}
                alt={review.product.name}
                className="w-full h-full object-cover"
                fallback="/placeholder-product.jpg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.product.name}</p>
            <p className="text-sm text-gray-500">Đơn hàng #{review.order?.orderNumber}</p>
          </div>
        </div>
      )}

      {/* Review Content */}
      <div className="space-y-3">
        {/* Comment */}
        <div className="text-gray-700">
          {isExpanded ? (
            <p className="whitespace-pre-wrap">{review.comment}</p>
          ) : (
            <p className="whitespace-pre-wrap">
              {truncateComment(review.comment)}
            </p>
          )}
          
          {review.comment.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </div>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {review.images.map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <SmartImage
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  fallback="/placeholder-image.jpg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Response */}
      {review.adminResponse && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <ChatBubbleLeftIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-blue-900">
                  {review.adminResponse.respondedBy?.firstName || 'Admin'} phản hồi
                </span>
                <span className="text-sm text-blue-600">
                  {formatReviewDate(review.adminResponse.respondedAt)}
                </span>
              </div>
              <p className="text-blue-800 whitespace-pre-wrap">
                {review.adminResponse.responseText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Helpful Button */}
          <button
            onClick={handleMarkHelpful}
            disabled={hasVoted || markingHelpful}
            className={`flex items-center space-x-1 text-sm ${
              hasVoted 
                ? 'text-blue-600 cursor-default' 
                : 'text-gray-500 hover:text-blue-600'
            } transition-colors`}
          >
            {hasVoted ? (
              <HandThumbUpSolid className="h-4 w-4" />
            ) : (
              <HandThumbUpIcon className="h-4 w-4" />
            )}
            <span>Hữu ích ({review.helpfulVotes})</span>
          </button>
        </div>

        {/* Report Button (for non-admin users) */}
        {!isAdmin && (
          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>Báo cáo</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;