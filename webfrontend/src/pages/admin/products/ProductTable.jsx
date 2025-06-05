// src/components/admin/products/ProductTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { formatPrice, formatDate, getImageUrl } from '../../../lib/utils';
import { useDeleteProduct } from '../../../hooks/useProducts';

const ProductTable = ({ 
  products = [], 
  loading = false, 
  viewMode = 'table'
}) => {
  const navigate = useNavigate();
  const { deleteProduct, loading: deleteLoading } = useDeleteProduct();

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
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {/* Status badges */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  {product.isFeatured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <StarIcon className="h-3 w-3 mr-1" />
                      Nổi bật
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? (
                      <>
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Đang bán
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-3 w-3 mr-1" />
                        Tạm dừng
                      </>
                    )}
                  </span>
                </div>

                {/* Stock warning */}
                {product.stock === 0 && (
                  <div className="absolute bottom-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Hết hàng
                    </span>
                  </div>
                )}
              </div>

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
                  <div className="flex-shrink-0 h-12 w-12">
                    {product.images && product.images.length > 0 ? (
                      <img
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <PhotoIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {product.name}
                      {product.isFeatured && (
                        <StarIcon className="h-4 w-4 text-yellow-500 inline ml-1" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.category?.name} • {product.brand?.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      SKU: {product.sku}
                    </div>
                  </div>
                </div>
              </td>

              {/* Price */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
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
                <div className="text-sm text-gray-900">
                  {product.stock}
                  {product.stock === 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Hết hàng
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Sắp hết
                    </span>
                  )}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? (
                    <>
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Đang bán
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-3 w-3 mr-1" />
                      Tạm dừng
                    </>
                  )}
                </span>
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(product.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(product._id)}
                    className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                    title="Xem chi tiết"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                    title="Chỉnh sửa"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    disabled={deleteLoading}
                    className="text-red-600 hover:text-red-900 p-1 rounded transition-colors disabled:opacity-50"
                    title="Xóa"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;