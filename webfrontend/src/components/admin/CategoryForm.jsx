import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Loader } from 'lucide-react';

const CategoryForm = ({ initialValues, onSubmit, isLoading }) => {
  const defaultValues = {
    name: '',
    description: '',
    image: '',
    isActive: true
  };

  const [values, setValues] = useState(initialValues || defaultValues);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialValues?.image || null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox'
      ? e.target.checked
      : value;
        
    setValues({ ...values, [name]: newValue });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setImageFile(file);
    
    // Generate preview
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const removeImage = () => {
    setImageFile(null);
    
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    
    setValues({ ...values, image: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!values.name.trim()) newErrors.name = 'Category name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // For now, just simulate the form submission
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
            <label htmlFor="name" className="form-label">Category Name*</label>
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

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={values.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active Category
            </label>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-4">
            <label className="form-label">Category Image</label>
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
                  />
                </label>
              </div>
            </div>

            {/* Image preview */}
            {imagePreview && (
              <div className="mt-4 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Category Preview"
                  className="h-40 w-auto border rounded"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={removeImage}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Saving...
            </>
          ) : (
            'Save Category'
          )}
        </button>
      </div>
    </form>
  );
};


export default CategoryForm;