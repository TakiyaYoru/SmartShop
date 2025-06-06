// src/components/admin/products/ProductTable.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ArrowsUpDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { formatPrice, formatDate, getImageUrl } from '../../../lib/utils';
import { useDeleteProduct, useUpdateProductImages, useSetMainProductImage, useDeleteProductImage } from '../../../hooks/useProducts';

const ProductTable = ({ 
  products = [], 
  loading = false, 
  viewMode = 'table'
}) => {
  const navigate = useNavigate();
  const { deleteProduct, loading: deleteLoading } = useDeleteProduct();
  const { updateProductImages, loading: updateImagesLoading } = useUpdateProductImages();
  const { setMainProductImage, loading: setMainLoading } = useSetMainProductImage();
  const { deleteProductImage, loading: deleteImageLoading } = useDeleteProductImage();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleView = (productId) => {
    // Sẽ implement sau
    console.log('View product:', productId);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      await deleteProduct(productId);
    }
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
  };

  const handleSetMainImage = async (productId, imageIndex) => {
    try {
      await setMainProductImage({
        variables: {
          id: productId,
          imageIndex
        }
      });
    } catch (error) {
      console.error('Error setting main image:', error);
      alert('Có lỗi xảy ra khi đặt ảnh chính');
    }
  };

  const handleDeleteImage = async (productId, imageIndex) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
      try {
        await deleteProductImage({
          variables: {
            id: productId,
            imageIndex
          }
        });
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Có lỗi xảy ra khi xóa ảnh');
      }
    }
  };

  // Image Modal Component
  const ImageModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Quản lý ảnh sản phẩm
                    </h3>
                    <button
                      onClick={() => setShowImageModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedProduct.images?.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(image)}
                          alt={`${selectedProduct.name} - ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            {index !== 0 && (
                              <button
                                onClick={() => handleSetMainImage(selectedProduct._id, index)}
                                disabled={setMainLoading}
                                className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                title="Đặt làm ảnh chính"
                              >
                                <ArrowsUpDownIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteImage(selectedProduct._id, index)}
                              disabled={deleteImageLoading}
                              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              title="Xóa ảnh"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              Ảnh chính
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowImageModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <PhotoIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có sản phẩm nào
        </h3>
        <p className="text-gray-500 mb-6">
          Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn
        </p>
        <button
          onClick={() => navigate('/admin/products/create')}
          className="btn btn-primary"
        >
          Thêm sản phẩm đầu tiên
        </button>
      </div>
    );
  }

  // Update the image click handler in both grid and table views
  const productImage = (product, size = 'small') => (
    <div 
      className={`relative ${size === 'small' ? 'h-12 w-12' : 'h-48'} cursor-pointer group`}
      onClick={() => handleImageClick(product)}
    >
      {product.images && product.images.length > 0 ? (
        <img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          className={`${
            size === 'small' 
              ? 'h-12 w-12 rounded-lg object-cover border border-gray-200' 
              : 'w-full h-full object-cover'
          }`}
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />
      ) : (
        <div className={`${
          size === 'small'
            ? 'h-12 w-12 rounded-lg'
            : 'w-full h-full'
          } bg-gray-100 flex items-center justify-center`}
        >
          <PhotoIcon className={`${size === 'small' ? 'h-6 w-6' : 'h-12 w-12'} text-gray-400`} />
        </div>
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all">
          <button className="px-2 py-1 bg-white bg-opacity-90 rounded text-xs font-medium">
            Quản lý ảnh
          </button>
        </div>
      </div>
    </div>
  );

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              {productImage(product, 'large')}

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {product.category?.name} • {product.brand?.name}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-lg font-bold text-red-600">
                    {formatPrice(product.price)}
                  </p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    Tồn kho: <span className="font-medium">{product.stock}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(product._id)}
                    className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <EyeIcon className="h-3 w-3 mr-1 inline" />
                    Xem
                  </button>
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="flex-1 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <PencilIcon className="h-3 w-3 mr-1 inline" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    disabled={deleteLoading}
                    className="px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showImageModal && <ImageModal />}
      </div>
    );
  }

  // Table View (default)
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Danh mục & Thương hiệu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giá
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tồn kho
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
              {/* Product Info */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {productImage(product, 'small')}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </div>
                  </div>
                </div>
              </td>

              {/* Category & Brand */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.category?.name || 'N/A'}</div>
                <div className="text-sm text-gray-500">{product.brand?.name || 'N/A'}</div>
              </td>

              {/* Price */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-red-600">
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
              </td>

              {/* Stock */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stock === 0
                    ? 'bg-red-100 text-red-800'
                    : product.stock < 10
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.stock} sản phẩm
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Đang bán' : 'Tạm dừng'}
                  </span>
                  {product.isFeatured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <StarIcon className="h-3 w-3 mr-1" />
                      Nổi bật
                    </span>
                  )}
                </div>
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(product.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(product._id)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Xem chi tiết"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Chỉnh sửa"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    disabled={deleteLoading}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    title="Xóa"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showImageModal && <ImageModal />}
    </div>
  );
};

export default ProductTable;