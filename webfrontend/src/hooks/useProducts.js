// src/hooks/useProducts.js
import { useQuery, useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  GET_PRODUCTS,
  GET_PRODUCT,
  SEARCH_PRODUCTS,
  GET_FEATURED_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_BRAND,
  GET_ALL_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT
} from '../graphql/products';
import {
  GET_ALL_CATEGORIES,
  GET_CATEGORIES
} from '../graphql/categories';
import {
  GET_ALL_BRANDS,
  GET_BRANDS
} from '../graphql/brands';

// Hook để lấy danh sách products với pagination và filter
export const useProducts = (options = {}) => {
  const {
    first = 12,
    offset = 0,
    orderBy = 'CREATED_DESC',
    condition = null,
    skip = false
  } = options;

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      first,
      offset,
      orderBy,
      condition
    },
    skip,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  const loadMore = () => {
    if (data?.products?.hasNextPage) {
      return fetchMore({
        variables: {
          offset: data.products.nodes.length
        }
      });
    }
  };

  return {
    products: data?.products?.nodes || [],
    totalCount: data?.products?.totalCount || 0,
    hasNextPage: data?.products?.hasNextPage || false,
    hasPreviousPage: data?.products?.hasPreviousPage || false,
    loading,
    error,
    loadMore,
    refetch
  };
};

// Hook để search products - Fixed để sử dụng useLazyQuery
export const useSearchProducts = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [searchProducts] = useLazyQuery(SEARCH_PRODUCTS, {
    onCompleted: (data) => {
      setSearchResults(data?.searchProducts?.nodes || []);
      setIsSearching(false);
    },
    onError: (error) => {
      console.error('Search error:', error);
      toast.error('Lỗi khi tìm kiếm sản phẩm');
      setIsSearching(false);
      setSearchResults([]);
    },
    errorPolicy: 'all'
  });

  const search = async (query, options = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      await searchProducts({
        variables: {
          query: query.trim(),
          first: options.first || 20,
          offset: options.offset || 0,
          orderBy: options.orderBy || 'CREATED_DESC'
        }
      });
    } catch (error) {
      console.error('Search execution error:', error);
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  return {
    searchResults,
    isSearching,
    search,
    clearSearch
  };
};

// Hook để lấy chi tiết 1 product
export const useProduct = (productId) => {
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
    skip: !productId,
    errorPolicy: 'all'
  });

  return {
    product: data?.product,
    loading,
    error
  };
};

// Hook để lấy featured products
export const useFeaturedProducts = () => {
  const { data, loading, error } = useQuery(GET_FEATURED_PRODUCTS, {
    errorPolicy: 'all'
  });

  return {
    featuredProducts: data?.featuredProducts || [],
    loading,
    error
  };
};

// Hook để lấy products theo category
export const useProductsByCategory = (categoryId) => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryId },
    skip: !categoryId,
    errorPolicy: 'all'
  });

  return {
    products: data?.productsByCategory || [],
    loading,
    error
  };
};

// Hook để lấy products theo brand
export const useProductsByBrand = (brandId) => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_BRAND, {
    variables: { brandId },
    skip: !brandId,
    errorPolicy: 'all'
  });

  return {
    products: data?.productsByBrand || [],
    loading,
    error
  };
};

// Hook để lấy categories cho filter
export const useCategories = () => {
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES, {
    errorPolicy: 'all'
  });

  return {
    categories: data?.allCategories || [],
    loading,
    error
  };
};

// Hook để lấy brands cho filter
export const useBrands = () => {
  const { data, loading, error } = useQuery(GET_ALL_BRANDS, {
    errorPolicy: 'all'
  });

  return {
    brands: data?.allBrands || [],
    loading,
    error
  };
};

// Admin hooks - sẽ cần useMutation cho các operations này
export const useCreateProduct = () => {
  // TODO: Implement với useMutation khi cần
  return {
    createProduct: () => console.log('Create product not implemented'),
    loading: false,
    error: null
  };
};

export const useUpdateProduct = () => {
  // TODO: Implement với useMutation khi cần  
  return {
    updateProduct: () => console.log('Update product not implemented'),
    loading: false,
    error: null
  };
};

export const useDeleteProduct = () => {
  // TODO: Implement với useMutation khi cần
  return {
    deleteProduct: () => console.log('Delete product not implemented'),
    loading: false,
    error: null
  };
};