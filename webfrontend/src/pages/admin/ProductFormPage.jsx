import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';

// Sample data - will be replaced with API calls
const sampleCategories = [
  { _id: '1', name: 'Smartphones' },
  { _id: '2', name: 'Laptops' },
  { _id: '3', name: 'Smart Home' },
  { _id: '4', name: 'Wearables' },
  { _id: '5', name: 'Accessories' }
];

const sampleProducts = [
  {
    _id: '1',
    name: 'iPhone 13 Pro Max',
    description: 'Apple\'s latest flagship phone with ProMotion display and A15 Bionic chip.',
    price: 1099,
    originalPrice: 1299,
    images: ['https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '1',
    brand: 'Apple',
    sku: 'IP13PM256',
    stock: 15,
    isActive: true,
    isFeatured: true
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S21',
    description: 'Flagship Android phone with excellent camera and performance.',
    price: 799,
    originalPrice: 999,
    images: ['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '1',
    brand: 'Samsung',
    sku: 'SGS21-128',
    stock: 20,
    isActive: true,
    isFeatured: false
  }
];

const ProductFormPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const isEditMode = !!id;

  useEffect(() => {
    // Simulate API call to get categories
    const fetchCategories = async () => {
      try {
        // In a real implementation, this would be an API call
        setTimeout(() => {
          setCategories(sampleCategories);
        }, 500);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    // If in edit mode, simulate API call to get product details
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          
          // In a real implementation, this would be an API call
          setTimeout(() => {
            const foundProduct = sampleProducts.find(p => p._id === id);
            if (foundProduct) {
              setProduct(foundProduct);
            }
            setLoading(false);
          }, 800);
        } catch (error) {
          console.error('Error fetching product:', error);
          setLoading(false);
        }
      };
      
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      console.log('Submitting product:', values);
      
      // Simulate API call to create/update product
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate back to product list on success
      navigate('/admin/products');
    } catch (error) {
      console.error('Error submitting product:', error);
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
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="flex gap-4">
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <ProductForm 
          initialValues={isEditMode && product ? {
            _id: product._id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            originalPrice: product.originalPrice || 0,
            sku: product.sku,
            category: product.category,
            brand: product.brand || '',
            images: product.images || [],
            stock: product.stock,
            isActive: product.isActive !== false,
            isFeatured: product.isFeatured || false
          } : undefined}
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      )}
    </div>
  );
};

export default ProductFormPage;