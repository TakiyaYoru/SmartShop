// src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import {
  GET_CART,
  GET_CART_ITEM_COUNT,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART
} from '../graphql/cart';

// Cart state structure
const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  loading: false,
  error: null
};

// Cart actions
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ITEM_COUNT: 'SET_ITEM_COUNT'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        subtotal: action.payload.subtotal || 0,
        loading: false,
        error: null
      };
    
    case CART_ACTIONS.ADD_ITEM:
      // Kiểm tra xem item đã tồn tại chưa
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );
      
      if (existingItemIndex > -1) {
        // Cập nhật item existing
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = action.payload;
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
        };
      } else {
        // Thêm item mới
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: newItems.reduce((sum, item) => sum + item.totalPrice, 0)
        };
      }
    
    case CART_ACTIONS.UPDATE_ITEM:
      const updatedItems = state.items.map(item =>
        item.product._id === action.payload.product._id ? action.payload : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
      };
    
    case CART_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(
        item => item.product._id !== action.payload
      );
      
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: filteredItems.reduce((sum, item) => sum + item.totalPrice, 0)
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        subtotal: 0
      };
    
    case CART_ACTIONS.SET_ITEM_COUNT:
      return {
        ...state,
        totalItems: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // GraphQL queries & mutations
  const { data: cartData, loading: cartLoading, refetch: refetchCart } = useQuery(GET_CART, {
    skip: !isAuthenticated,
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.getCart) {
        dispatch({ type: CART_ACTIONS.SET_CART, payload: data.getCart });
      }
    },
    onError: (error) => {
      console.error('Error fetching cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
    }
  });

  const { data: itemCountData } = useQuery(GET_CART_ITEM_COUNT, {
    skip: !isAuthenticated,
    pollInterval: 30000, // Poll every 30 seconds
    onCompleted: (data) => {
      if (data?.getCartItemCount !== undefined) {
        dispatch({ type: CART_ACTIONS.SET_ITEM_COUNT, payload: data.getCartItemCount });
      }
    }
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART, {
    onCompleted: (data) => {
      dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: data.addToCart });
      toast.success('Đã thêm vào giỏ hàng!');
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi khi thêm vào giỏ hàng');
    }
  });

  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM, {
    onCompleted: (data) => {
      dispatch({ type: CART_ACTIONS.UPDATE_ITEM, payload: data.updateCartItem });
      toast.success('Đã cập nhật giỏ hàng!');
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi khi cập nhật giỏ hàng');
    }
  });

  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, {
    onCompleted: (data, { variables }) => {
      if (data.removeFromCart) {
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: variables.productId });
        toast.success('Đã xóa khỏi giỏ hàng!');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi khi xóa khỏi giỏ hàng');
    }
  });

  const [clearCartMutation] = useMutation(CLEAR_CART, {
    onCompleted: (data) => {
      if (data.clearCart) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        toast.success('Đã xóa toàn bộ giỏ hàng!');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi khi xóa giỏ hàng');
    }
  });

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [isAuthenticated]);

  // Cart actions
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await addToCartMutation({
        variables: {
          input: { productId, quantity }
        }
      });
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await updateCartItemMutation({
        variables: {
          input: { productId, quantity }
        }
      });
    } catch (error) {
      console.error('Update cart item error:', error);
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await removeFromCartMutation({
        variables: { productId }
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await clearCartMutation();
    } catch (error) {
      console.error('Clear cart error:', error);
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const refreshCart = () => {
    if (isAuthenticated) {
      refetchCart();
    }
  };

  // Helper functions
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  const getTotalPrice = () => {
    return state.subtotal;
  };

  const value = {
    // State
    cart: state,
    loading: state.loading || cartLoading,
    error: state.error,
    
    // Actions
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    
    // Helper functions
    getItemQuantity,
    isInCart,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};