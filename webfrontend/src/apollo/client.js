import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  credentials: 'same-origin',
});

// Middleware để thêm authentication token vào header
const authLink = setContext((_, { headers }) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('auth_token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ['condition', 'orderBy'],
            merge(existing, incoming, { args = {} }) {
              const { offset = 0 } = args;
              
              // Get merged nodes
              const nodes = existing ? [...existing.nodes] : [];
              if (incoming.nodes) {
                for (let i = 0; i < incoming.nodes.length; ++i) {
                  nodes[offset + i] = incoming.nodes[i];
                }
              }
              
              return {
                ...incoming,
                nodes,
              };
            },
          },
          categories: {
            keyArgs: ['condition', 'orderBy'],
            merge(existing, incoming, { args = {} }) {
              const { offset = 0 } = args;
              
              // Get merged nodes
              const nodes = existing ? [...existing.nodes] : [];
              if (incoming.nodes) {
                for (let i = 0; i < incoming.nodes.length; ++i) {
                  nodes[offset + i] = incoming.nodes[i];
                }
              }
              
              return {
                ...incoming,
                nodes,
              };
            },
          },
          allCategories: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
}); 