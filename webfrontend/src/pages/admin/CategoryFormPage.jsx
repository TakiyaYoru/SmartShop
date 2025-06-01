import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryForm from '../../components/admin/CategoryForm';
import { ArrowLeft } from 'lucide-react';

// Sample data - will be replaced with API calls
const sampleCategories = [
  {
    _id: '1',
    name: 'Smartphones',
    description: 'Latest mobile phones and smartphones from all brands',
    image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true
  },
  {
    _id: '2',
    name: 'Laptops',
    description: 'Powerful laptops for work, gaming and creative professionals',
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true
  }
];

const CategoryFormPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const isEditMode = !!id;

  useEffect(() => {
    // If in edit mode, simulate API call to get category details
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          
          // In a real implementation, this would be an API call
          setTimeout(() => {
            const foundCategory = sampleCategories.find(c => c._id === id);
            if (foundCategory) {
              setCategory(foundCategory);
            }
            setLoading(false);
          }, 800);
        } catch (error) {
          console.error('Error fetching category:', error);
          setLoading(false);
        }
      };
      
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      console.log('Submitting category:', values);
      
      // Simulate API call to create/update category
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate back to category list on success
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error submitting category:', error);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">
          {isEditMode ? 'Edit Category' : 'Add New Category'}
        </h2>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <CategoryForm 
          initialValues={isEditMode && category ? {
            _id: category._id,
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            isActive: category.isActive !== false
          } : undefined}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      )}
    </div>
  );
};

export default CategoryFormPage;