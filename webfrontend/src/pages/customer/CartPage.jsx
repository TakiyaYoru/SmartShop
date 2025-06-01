import React from 'react';
import { Link } from 'react-router-dom';
import { Trash, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
          <div className="mb-6 text-gray-400 flex justify-center">
            <ShoppingBag size={64} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Price
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.image || 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <Link to={`/products/${item._id}`} className="hover:text-blue-600">
                                {item.name}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item._id, value);
                              }
                            }}
                            min="1"
                            className="w-12 h-8 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-0 focus:border-gray-300"
                          />
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          ${item.price.toFixed(2)} each
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove item"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
                ← Continue Shopping
              </Link>
              <button 
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <Trash size={18} className="mr-1" />
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-blue-700">${(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full btn-primary py-3"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-gray-600 mb-4">We accept:</p>
                <div className="flex space-x-2">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;