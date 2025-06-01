import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPLOAD_PRODUCT_IMAGES, REMOVE_PRODUCT_IMAGE } from '../../graphql/productQueries';
import { X, Upload, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductForm = ({ 
  initialValues,
  categories,
  onSubmit,
  isLoading
}) => {
  const defaultValues = {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    sku: '',
    category: '',
    brand: '',
    images: [],
    stock: 0,
    isActive: true,
    isFeatured: false
  };

  const [values, setValues] = useState(initialValues || defaultValues);
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const navigate = useNavigate();

  // Load initial images for preview
  useEffect(() => {
    if (initialValues?.images && initialValues.images.length > 0) {
      const initialImagePreviews = initialValues.images.map(img => 
        img.startsWith('product_') ? `/img/${img}` : img
      );
      setImagePreviewUrls(initialImagePreviews);
    }
  }, [initialValues?.images]);

  // Upload images mutation
  const [uploadImages] = useMutation(UPLOAD_PRODUCT_IMAGES);
  const [removeImage] = useMutation(REMOVE_PRODUCT_IMAGE);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox'
      ? e.target.checked
      : type === 'number' 
        ? parseFloat(value) || 0
        : value;
        
    setValues({ ...values, [name]: newValue });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Validate files
    const validFiles = Array.from(e.target.files).filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" không phải là hình ảnh`);
        return false;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" vượt quá 5MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;
    
    setImageFiles(prev => [...prev, ...validFiles]);
    
    // Generate previews for new files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImagePreview = (index) => {
    // If it's an existing image (from server)
    if (index < (values.images?.length || 0)) {
      const imageToRemove = values.images[index];
      if (values._id) {
        removeImage({
          variables: {
            productId: values._id,
            filename: imageToRemove
          }
        }).then(() => {
          setValues(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
          }));
          setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
          toast.success('Đã xóa hình ảnh');
        }).catch(error => {
          toast.error('Không thể xóa hình ảnh: ' + error.message);
        });
      } else {
        setValues(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
        }));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
      }
    } 
    // If it's a new image (not yet uploaded)
    else {
      const fileIndex = index - (values.images?.length || 0);
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!values.name.trim()) newErrors.name = 'Product name is required';
    if (!values.price || values.price <= 0) newErrors.price = 'Valid price is required';
    if (!values.sku.trim()) newErrors.sku = 'SKU is required';
    if (!values.category) newErrors.category = 'Category is required';
    if (!values.stock || values.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Submit the form with all values including image files
      await onSubmit({
        ...values,
        imageFiles // Pass the image files to parent
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Error saving product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="form-label">Product Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={5}
              className="form-input"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="form-label">Price*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={values.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`form-input ${errors.price ? 'border-red-500' : ''}`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          {/* Original Price */}
          <div className="mb-4">
            <label htmlFor="originalPrice" className="form-label">Original Price</label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={values.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>

          {/* SKU */}
          <div className="mb-4">
            <label htmlFor="sku" className="form-label">SKU*</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={values.sku}
              onChange={handleChange}
              className={`form-input ${errors.sku ? 'border-red-500' : ''}`}
            />
            {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="form-label">Category*</label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              className={`form-input ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>

          {/* Brand */}
          <div className="mb-4">
            <label htmlFor="brand" className="form-label">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={values.brand}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label htmlFor="stock" className="form-label">Stock*</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={values.stock}
              onChange={handleChange}
              min="0"
              className={`form-input ${errors.stock ? 'border-red-500' : ''}`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
          </div>

          {/* Status Checkboxes */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={values.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={values.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                Featured Product
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="mb-4">
            <label className="form-label">Product Images</label>
            <div className="mt-2 border-2 border-dashed border-gray-300 p-6 rounded-md">
              <div className="flex items-center justify-center">
                <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={36} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input 
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                </label>
              </div>
            </div>

            {/* Image previews */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-40 object-cover border rounded"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() => removeImagePreview(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isLoading || uploadingImages}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || uploadingImages}
        >
          {isLoading || uploadingImages ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              {uploadingImages ? 'Uploading Images...' : 'Saving...'}
            </>
          ) : (
            'Save Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;