import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };
  
  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Badge for featured or discount */}
      {(product.isFeatured || discountPercentage > 0) && (
        <div className="absolute top-3 left-3 z-10">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
              {discountPercentage}% OFF
            </span>
          )}
          {product.isFeatured && !discountPercentage && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
              Featured
            </span>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="absolute top-3 right-3 z-10 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors text-gray-700"
          title="Add to wishlist"
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Product image */}
      <Link to={`/products/${product._id}`}>
        <div className="relative pt-[100%] overflow-hidden rounded-t-lg">
          <img
            src={product.images?.[0] || 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-6"
          />
        </div>
      </Link>

      {/* Product info */}
      <div className="p-4">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10 mb-1">
            {product.name}
          </h3>
          
          <div className="mt-2 mb-1 flex items-baseline">
            <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {product.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {product.description}
            </p>
          )}
        </Link>
        
        {/* Add to cart button */}
        <button
          className="mt-3 w-full bg-blue-600 text-white flex items-center justify-center rounded-md py-2 text-sm hover:bg-blue-700 transition-colors"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart size={16} className="mr-2" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;