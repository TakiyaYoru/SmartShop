// webfrontend/src/components/cart/CartItem.jsx
import React, { useState } from 'react';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart, isLoading } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity <= 0) return;
    
    setIsUpdating(true);
    try {
      await updateCartItem(item.product._id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      await removeFromCart(item.product._id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const productImage = item.product.images && item.product.images.length > 0 
    ? `http://localhost:4000${item.product.images[0]}`
    : '/placeholder-product.jpg';

  const isItemLoading = isLoading || isUpdating;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${isItemLoading ? 'opacity-50' : ''}`}>
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={productImage}
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded-md"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {item.product.name}
          </h3>
          <p className="text-sm text-gray-500">
            {item.product.category?.name} • {item.product.brand?.name}
          </p>
          <p className="text-sm font-medium text-blue-600">
            {formatPrice(item.unitPrice)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isItemLoading || item.quantity <= 1}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isItemLoading || item.quantity >= item.product.stock}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(item.totalPrice)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isItemLoading}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          title="Xóa khỏi giỏ hàng"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Stock Warning */}
      {item.quantity >= item.product.stock && (
        <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
          ⚠️ Đã đạt giới hạn tồn kho ({item.product.stock} sản phẩm)
        </div>
      )}
    </div>
  );
};

export default CartItem;