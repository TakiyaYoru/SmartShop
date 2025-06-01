import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CATEGORY_BY_ID, CREATE_CATEGORY, UPDATE_CATEGORY } from '../../graphql/categoryQueries';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query for getting category details in edit mode
  const { loading: loadingCategory } = useQuery(GET_CATEGORY_BY_ID, {
    variables: { id },
    skip: !isEditMode,
    onCompleted: (data) => {
      if (data.category) {
        setFormData({
          name: data.category.name,
          description: data.category.description || '',
          isActive: data.category.isActive
        });
      }
    }
  });

  // Mutations for creating/updating category
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: (data) => {
      if (data.createCategory) {
        toast.success('Category created successfully');
        navigate('/admin/categories');
      } else {
        toast.error('Failed to create category');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Error creating category');
    }
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: (data) => {
      if (data.updateCategory) {
        toast.success('Category updated successfully');
        navigate('/admin/categories');
      } else {
        toast.error('Failed to update category');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Error updating category');
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateCategory({
          variables: {
            id,
            input: formData
          }
        });
      } else {
        await createCategory({
          variables: {
            input: formData
          }
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && loadingCategory) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/categories')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">
          {isEditMode ? 'Edit Category' : 'Create New Category'}
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditMode ? 'Update Category' : 'Create Category'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}