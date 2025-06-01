import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_PRODUCT_BY_ID, 
  GET_CATEGORIES_FOR_SELECT, 
  CREATE_PRODUCT, 
  UPDATE_PRODUCT,
  UPLOAD_PRODUCT_IMAGES,
  GET_ALL_PRODUCTS 
} from '../../graphql/productQueries';
import ProductForm from '../../components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductFormPage = () => {
  const { id } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const isEditMode = !!id;

  // Fetch categories
  const { data: categoriesData, loading: loadingCategories } = useQuery(GET_CATEGORIES_FOR_SELECT);

  // Fetch product data if in edit mode
  const { data: productData, loading: loadingProduct } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !isEditMode,
  });

  // Setup mutations
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [uploadImages] = useMutation(UPLOAD_PRODUCT_IMAGES);

  const loading = loadingCategories || (isEditMode && loadingProduct);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // First, create/update the product
      const productInput = {
        name: values.name.trim(),
        description: values.description ? values.description.trim() : '',
        price: Number(values.price),
        originalPrice: values.originalPrice ? Number(values.originalPrice) : null,
        sku: values.sku.trim(),
        category: values.category,
        brand: values.brand ? values.brand.trim() : '',
        stock: Number(values.stock),
        isActive: Boolean(values.isActive),
        isFeatured: Boolean(values.isFeatured)
      };

      console.log('Product Input:', productInput);

      let savedProduct;
      
      try {
        if (isEditMode) {
          console.log('Updating product with ID:', id);
          const result = await updateProduct({
            variables: {
              id,
              input: productInput
            }
          });
          console.log('Update result:', result);
          
          if (result?.data?.updateProduct) {
            savedProduct = result.data.updateProduct;
            toast.success('Đã cập nhật thông tin sản phẩm');
          } else {
            throw new Error('Không thể cập nhật sản phẩm');
          }
        } else {
          console.log('Creating new product');
          const result = await createProduct({
            variables: {
              input: productInput
            }
          });
          console.log('Create result:', result);
          
          if (result?.data?.createProduct) {
            savedProduct = result.data.createProduct;
            toast.success('Đã tạo sản phẩm mới');
          } else {
            throw new Error('Không thể tạo sản phẩm mới');
          }
        }

        // If we have a saved product and new images
        if (savedProduct?._id && values.imageFiles?.length > 0) {
          console.log('Uploading images for product:', savedProduct._id);
          try {
            const files = Array.from(values.imageFiles);
            console.log('Files to upload:', files.map(f => f.name));

            // Upload each file individually
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              
              // Create FormData
              const formData = new FormData();
              formData.append('operations', JSON.stringify({
                query: `
                  mutation UploadProductImages($productId: ID!, $files: [File!]!) {
                    uploadProductImages(productId: $productId, files: $files) {
                      success
                      message
                      filename
                      url
                    }
                  }
                `,
                variables: {
                  productId: savedProduct._id,
                  files: [null]
                }
              }));
              
              formData.append('map', JSON.stringify({
                "0": ["variables.files.0"]
              }));
              
              formData.append('0', file);

              const uploadResult = await fetch('http://localhost:4000/', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData
              });

              const uploadData = await uploadResult.json();
              console.log(`Upload result for file ${i + 1}:`, uploadData);

              if (!uploadData?.data?.uploadProductImages?.success) {
                console.error(`Upload failed for file ${i + 1}:`, uploadData);
                toast.error(`Không thể tải lên file ${file.name}`);
              }
            }

            toast.success('Đã tải lên hình ảnh thành công');
          } catch (uploadError) {
            console.error('Lỗi khi tải lên hình ảnh:', uploadError);
            toast.error(uploadError.message || 'Không thể tải lên hình ảnh');
          }
        }

        // Navigate back to product list on success
        navigate('/admin/products');
      } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error);
        toast.error(error.message || 'Lỗi khi lưu sản phẩm');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Lỗi khi xử lý form:', error);
      toast.error(error.message || 'Có lỗi xảy ra');
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
          {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
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
          initialValues={isEditMode && productData?.product ? {
            _id: productData.product._id,
            name: productData.product.name,
            description: productData.product.description || '',
            price: productData.product.price,
            originalPrice: productData.product.originalPrice || 0,
            sku: productData.product.sku,
            category: productData.product.category._id,
            brand: productData.product.brand || '',
            images: productData.product.images || [],
            stock: productData.product.stock,
            isActive: productData.product.isActive !== false,
            isFeatured: productData.product.isFeatured || false
          } : undefined}
          categories={categoriesData?.allCategories || []}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      )}
    </div>
  );
};

export default ProductFormPage;