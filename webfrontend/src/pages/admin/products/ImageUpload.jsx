// src/components/admin/products/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import {
  PhotoIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useUploadProductImage, useRemoveProductImage } from '../../../hooks/useUpload';
import { getImageUrl } from '../../../lib/utils';

const ImageUpload = ({ 
  productId, 
  images = [], 
  onImagesChange, 
  maxImages = 5 
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { uploadImage, loading: uploadLoading } = useUploadProductImage();
  const { removeImage, loading: removeLoading } = useRemoveProductImage();

  const handleFileSelect = (files) => {
    if (!productId) {
      alert('Vui lòng tạo sản phẩm trước khi upload ảnh');
      return;
    }

    if (images.length + files.length > maxImages) {
      alert(`Chỉ được upload tối đa ${maxImages} ảnh`);
      return;
    }

    uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    const newImages = [...images];

    for (let file of files) {
      try {
        const result = await uploadImage(productId, file);
        if (result.success && result.filename) {
          newImages.push(result.filename);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    onImagesChange(newImages);
    setUploading(false);
  };

  const handleRemoveImage = async (filename, index) => {
    if (!productId) {
      // Nếu chưa có productId, chỉ remove khỏi state
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      return;
    }

    try {
      await removeImage(productId, filename);
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Remove image error:', error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Hình ảnh sản phẩm ({images.length}/{maxImages})
      </label>

      {/* Current Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={getImageUrl(image)}
                alt={`Product ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(image, index)}
                disabled={removeLoading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                  Chính
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {uploading || uploadLoading ? (
            <div className="space-y-2">
              <CloudArrowUpIcon className="h-12 w-12 text-blue-500 mx-auto animate-bounce" />
              <p className="text-sm text-blue-600 font-medium">Đang upload...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Chọn ảnh
              </button>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500">
        <p>• Ảnh đầu tiên sẽ được làm ảnh chính</p>
        <p>• Kích thước tối ưu: 800x800px</p>
        <p>• Định dạng: JPG, PNG, GIF</p>
      </div>
    </div>
  );
};

export default ImageUpload;