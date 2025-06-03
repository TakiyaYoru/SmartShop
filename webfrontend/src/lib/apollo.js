// src/lib/apollo.js
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP link tới GraphQL server
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/',
});

// Auth link để thêm JWT token vào headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('smartshop_token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      // Loại bỏ secret header để tránh CORS error
      // secret sẽ được gửi qua variables trong queries khi cần
    }
  };
});

// Error link để handle errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
      
      // Nếu token expired, redirect to login
      if (message.includes('Authentication required') || message.includes('jwt')) {
        localStorage.removeItem('smartshop_token');
        localStorage.removeItem('smartshop_user');
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
  }
});

// Apollo Client instance
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache policies cho pagination
          products: {
            keyArgs: ['condition', 'orderBy'],
            merge(existing = { nodes: [], totalCount: 0 }, incoming) {
              return {
                ...incoming,
                nodes: [...(existing.nodes || []), ...incoming.nodes],
              };
            },
          },
          categories: {
            keyArgs: ['condition', 'orderBy'],
            merge(existing = { nodes: [], totalCount: 0 }, incoming) {
              return {
                ...incoming,
                nodes: [...(existing.nodes || []), ...incoming.nodes],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});