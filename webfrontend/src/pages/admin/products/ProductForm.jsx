// src/pages/admin/products/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useProductFormData } from '../../../hooks/useProducts';
import { formatPrice, getImageUrl } from '../../../lib/utils';

const ProductForm = ({ 
  product = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { categories, brands, loading: formDataLoading } = useProductFormData();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    sku: '',
    category: '',
    brand: '',
    stock: '',
    isActive: true,
    isFeatured: false
  });

  // State for image files to upload
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        sku: product.sku || '',
        category: product.category?._id || '',
        brand: product.brand?._id || '',
        stock: product.stock || '',
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false
      });
      // Reset image files when editing (existing images are handled separately)
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image files selection
  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} không phải là ảnh`);
        return false;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn (max 10MB)`);
        return false;
      }
      return true;
    });

    // Check total images limit
    const currentImages = product?.images?.length || 0;
    const totalImages = currentImages + imageFiles.length + validFiles.length;
    
    if (totalImages > 5) {
      toast.error('Tối đa 5 ảnh cho mỗi sản phẩm');
      return;
    }

    // Update files state
    const newFiles = [...imageFiles, ...validFiles];
    setImageFiles(newFiles);

    // Create previews
    const newPreviews = [...imagePreviews];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          file,
          url: e.target.result,
          name: file.name
        });
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image file from upload queue
  const removeImageFile = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU là bắt buộc';
    }

    if (!formData.category) {
      newErrors.category = 'Danh mục là bắt buộc';
    }

    if (!formData.brand) {
      newErrors.brand = 'Thương hiệu là bắt buộc';
    }

    if (formData.stock === '' || formData.stock < 0) {
      newErrors.stock = 'Số lượng tồn kho không được âm';
    }

    if (formData.originalPrice && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = 'Giá gốc phải lớn hơn giá bán';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert string numbers to numbers
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock)
    };

    // Pass both product data and image files to parent
    console.log('📝 Submitting form:', { submitData, imageFiles });
    onSubmit(submitData, imageFiles);
  };

  if (formDataLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="form-label">Tên sản phẩm *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* SKU */}
          <div>
            <label className="form-label">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`input ${errors.sku ? 'input-error' : ''}`}
              placeholder="VD: IPHONE15-128GB"
            />
            {errors.sku && <p className="form-error">{errors.sku}</p>}
          </div>

          {/* Stock */}
          <div>
            <label className="form-label">Số lượng tồn kho *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`input ${errors.stock ? 'input-error' : ''}`}
              placeholder="0"
            />
            {errors.stock && <p className="form-error">{errors.stock}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="form-label">Giá bán (VNĐ) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1000"
              className={`input ${errors.price ? 'input-error' : ''}`}
              placeholder="0"
            />
            {errors.price && <p className="form-error">{errors.price}</p>}
            {formData.price && (
              <p className="text-sm text-gray-500 mt-1">
                {formatPrice(formData.price)}
              </p>
            )}
          </div>

          {/* Original Price */}
          <div>
            <label className="form-label">Giá gốc (VNĐ)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              min="0"
              step="1000"
              className={`input ${errors.originalPrice ? 'input-error' : ''}`}
              placeholder="Để trống nếu không có"
            />
            {errors.originalPrice && <p className="form-error">{errors.originalPrice}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Danh mục *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input ${errors.category ? 'input-error' : ''}`}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category}</p>}
          </div>

          {/* Brand */}
          <div>
            <label className="form-label">Thương hiệu *</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`input ${errors.brand ? 'input-error' : ''}`}
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && <p className="form-error">{errors.brand}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Mô tả sản phẩm</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input resize-none"
            placeholder="Nhập mô tả chi tiết về sản phẩm..."
          />
        </div>

        {/* Images Section */}
        <div>
          <label className="form-label">
            Hình ảnh sản phẩm ({(product?.images?.length || 0) + imageFiles.length}/5)
          </label>
          
          {/* Existing Images (Edit mode) */}
          {product?.images && product.images.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Ảnh hiện tại:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={getImageUrl(image)}
                      alt={`Current ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                        Chính
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Preview */}
          {imagePreviews.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Ảnh mới sẽ upload:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.url}
                      alt={`New ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-green-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                      Mới
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          {((product?.images?.length || 0) + imageFiles.length) < 5 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Chọn ảnh để thêm
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageFilesChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB. Tối đa 5 ảnh.
              </p>
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Kích hoạt</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Sản phẩm nổi bật</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {product ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              product ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;