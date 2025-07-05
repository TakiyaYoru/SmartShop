// File: webfrontend/src/components/reviews/CreateReviewForm.jsx
import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import {
  StarIcon,
  PhotoIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

import { CREATE_REVIEW, CAN_REVIEW_PRODUCT, GET_PRODUCT_REVIEWS } from '../../graphql/reviews';
import { useAuth } from '../../contexts/AuthContext';
import { SmartImage } from '../../utils/imageHelper';

const CreateReviewForm = ({ productId, product, onReviewCreated, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    images: []
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Check if user can review this product
  const { data: eligibilityData, loading: checkingEligibility } = useQuery(CAN_REVIEW_PRODUCT, {
    variables: { productId },
    skip: !user
  });

  const [createReview, { loading: creating }] = useMutation(CREATE_REVIEW, {
    onCompleted: (data) => {
      toast.success('Đánh giá của bạn đã được gửi thành công!');
      setFormData({ rating: 0, comment: '', images: [] });
      if (onReviewCreated) {
        onReviewCreated(data.createReview);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi đánh giá');
    },
    refetchQueries: [
      {
        query: GET_PRODUCT_REVIEWS,
        variables: { productId, first: 10, offset: 0, orderBy: 'CREATED_DESC' }
      }
    ]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rating) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!formData.comment.trim() || formData.comment.trim().length < 10) {
      toast.error('Vui lòng nhập ít nhất 10 ký tự cho nhận xét');
      return;
    }

    const eligibility = eligibilityData?.canReviewProduct;
    if (!eligibility?.canReview) {
      toast.error('Bạn không thể đánh giá sản phẩm này');
      return;
    }

    try {
      await createReview({
        variables: {
          input: {
            productId,
            orderId: eligibility.orderId,
            orderItemId: eligibility.orderItemId,
            rating: formData.rating,
            comment: formData.comment.trim(),
            images: formData.images
          }
        }
      });
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  const handleImageUpload = useCallback((files) => {
    const maxImages = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const validFiles = Array.from(files).filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Chỉ hỗ trợ file JPG, PNG, WEBP`);
        return false;
      }
      if (file.size > maxFileSize) {
        toast.error(`${file.name}: File quá lớn (tối đa 5MB)`);
        return false;
      }
      return true;
    });

    if (formData.images.length + validFiles.length > maxImages) {
      toast.error(`Chỉ có thể tải lên tối đa ${maxImages} ảnh`);
      return;
    }

    // Convert files to base64 URLs for preview
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  }, [formData.images.length]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((rating) => {
      const isFilled = rating <= (hoveredRating || formData.rating);
      return (
        <button
          key={rating}
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, rating }))}
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          {isFilled ? (
            <StarSolid className="h-8 w-8 text-yellow-400" />
          ) : (
            <StarIcon className="h-8 w-8 text-gray-300" />
          )}
        </button>
      );
    });
  };

  if (checkingEligibility) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const eligibility = eligibilityData?.canReviewProduct;
  
  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">
          Vui lòng <strong>đăng nhập</strong> để viết đánh giá cho sản phẩm này.
        </p>
      </div>
    );
  }

  if (!eligibility?.canReview) {
    const messages = {
      already_reviewed: "Bạn đã đánh giá sản phẩm này rồi.",
      not_purchased: "Chỉ khách hàng đã mua và nhận hàng mới có thể đánh giá sản phẩm."
    };
    
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          {messages[eligibility?.reason] || "Bạn không thể đánh giá sản phẩm này."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Đánh giá sản phẩm</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        {product && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
              {product.images?.[0] ? (
                <SmartImage
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  fallback="/placeholder-product.jpg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-500">
                Bạn đã mua sản phẩm này và có thể đánh giá
              </p>
            </div>
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Đánh giá của bạn *
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
          </div>
          {formData.rating > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Bạn đã chọn {formData.rating} sao
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhận xét của bạn *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={1000}
          />
          <div className="mt-1 flex justify-between text-sm text-gray-500">
            <span>Tối thiểu 10 ký tự</span>
            <span>{formData.comment.length}/1000</span>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thêm hình ảnh (không bắt buộc)
          </label>
          
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Kéo thả ảnh vào đây hoặc{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                  <span>chọn file</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, WEBP - Tối đa 5 ảnh, mỗi ảnh không quá 5MB
              </p>
            </div>
          </div>

          {/* Image Previews */}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={creating || !formData.rating || formData.comment.trim().length < 10}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            <span>{creating ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReviewForm;