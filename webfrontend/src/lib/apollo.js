// ==========================================
// FILE: webfrontend/src/lib/apollo.js - FIXED AUTH HEADER
// ==========================================

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Create HTTP link
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  // ✅ Add credentials
  credentials: 'include',
});

// ✅ AUTH LINK - FIXED
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('smartshop_token');
  
  console.log('🔍 Apollo Auth Link Debug:');
  console.log('  - token exists:', !!token);
  console.log('  - token value:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN');
  
  const authHeaders = {
    ...headers,
    ...(token && { authorization: `Bearer ${token}` })
  };
  
  console.log('  - final headers:', authHeaders);
  
  return {
    headers: authHeaders
  };
});

// ✅ ERROR LINK
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`🔴 GraphQL error: ${message} at ${path}`);
    });
  }

  if (networkError) {
    console.error(`🔴 Network error:`, networkError);
    
    if (networkError.statusCode === 401) {
      console.log('🔄 Clearing auth and redirecting to login');
      localStorage.removeItem('smartshop_token');
      localStorage.removeItem('smartshop_user');
      window.location.href = '/login';
    }
  }
});

// ✅ APOLLO CLIENT
export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getMyCart: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          products: {
            keyArgs: ["condition", "orderBy"],
            merge(existing = { nodes: [], totalCount: 0 }, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: false,
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: false,
});

// ✅ UTILITY FUNCTIONS
export const clearApolloCache = () => {
  client.cache.reset();
};

export const refetchQueries = (queries) => {
  return client.refetchQueries({
    include: queries,
  });
};