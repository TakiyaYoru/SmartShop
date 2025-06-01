import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Loader } from 'lucide-react';

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
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Generate previews for new files
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // If it's an existing image
    if (index < (initialValues?.images?.length || 0)) {
      const updatedImages = [...values.images];
      updatedImages.splice(index, 1);
      setValues({ ...values, images: updatedImages });
      
      const updatedPreviews = [...imagePreviewUrls];
      updatedPreviews.splice(index, 1);
      setImagePreviewUrls(updatedPreviews);
    } 
    // If it's a new image
    else {
      const newFileIndex = index - (initialValues?.images?.length || 0);
      
      const updatedFiles = [...imageFiles];
      updatedFiles.splice(newFileIndex, 1);
      setImageFiles(updatedFiles);
      
      const updatedPreviews = [...imagePreviewUrls];
      updatedPreviews.splice(index, 1);
      setImagePreviewUrls(updatedPreviews);
      
      // Clean up the URL to prevent memory leaks
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!values.name.trim()) newErrors.name = 'Product name is required';
    if (values.price <= 0) newErrors.price = 'Price must be greater than zero';
    if (!values.sku.trim()) newErrors.sku = 'SKU is required';
    if (!values.category) newErrors.category = 'Please select a category';
    if (values.stock < 0) newErrors.stock = 'Stock cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // First, handle the basic product data
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="form-label">Price* ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={values.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`form-input ${errors.price ? 'border-red-500' : ''}`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="originalPrice" className="form-label">Original Price ($)</label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={values.originalPrice || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
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

            <div>
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
          </div>

          <div className="flex items-center space-x-6">
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
        </div>

        {/* Right Column */}
        <div>
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
                    onClick={() => removeImage(index)}
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
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Saving...
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