import { gql } from '@apollo/client';

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int, $offset: Int, $orderBy: ProductsOrderBy, $condition: ProductConditionInput) {
    products(first: $first, offset: $offset, orderBy: $orderBy, condition: $condition) {
      nodes {
        _id
        name
        description
        price
        originalPrice
        sku
        category {
          _id
          name
        }
        brand
        images
        stock
        isActive
        isFeatured
      }
      totalCount
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      _id
      name
      description
      price
      originalPrice
      sku
      category {
        _id
        name
      }
      brand
      images
      stock
      isActive
      isFeatured
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      _id
      name
      description
      price
      originalPrice
      sku
      category {
        _id
        name
      }
      brand
      images
      stock
      isActive
      isFeatured
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      _id
      name
      description
      price
      originalPrice
      sku
      category {
        _id
        name
      }
      brand
      images
      stock
      isActive
      isFeatured
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const UPLOAD_PRODUCT_IMAGES = gql`
  mutation UploadProductImages($productId: ID!, $files: [File!]!) {
    uploadProductImages(productId: $productId, files: $files) {
      success
      message
      filename
      url
    }
  }
`;

export const REMOVE_PRODUCT_IMAGE = gql`
  mutation RemoveProductImage($productId: ID!, $filename: String!) {
    removeProductImage(productId: $productId, filename: $filename)
  }
`;

// Query to get all categories for the product form
export const GET_CATEGORIES_FOR_SELECT = gql`
  query GetCategoriesForSelect {
    allCategories {
      _id
      name
    }
  }
`; 