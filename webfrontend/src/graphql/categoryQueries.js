import { gql } from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($first: Int, $offset: Int, $condition: CategoryConditionInput) {
    categories(first: $first, offset: $offset, condition: $condition) {
      nodes {
        _id
        name
        description
        isActive
      }
      totalCountS
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      _id
      name
      description
      isActive
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      _id
      name
      description
      isActive
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      _id
      name
      description
      isActive
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const UPLOAD_FILE = gql`
  mutation UploadFile($file: File!) {
    upload(file: $file)
  }
`; 