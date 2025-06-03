// src/graphql/auth.js
import { gql } from '@apollo/client';

// Login mutation
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      data {
        jwt
        user {
          _id
          username
          email
          firstName
          lastName
          role
        }
      }
    }
  }
`;

// Register mutation
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      message
      data {
        _id
        username
        email
        firstName
        lastName
        role
      }
    }
  }
`;

// Get current user query
export const ME_QUERY = gql`
  query Me {
    me {
      _id
      username
      email
      firstName
      lastName
      role
    }
  }
`;