import { createSchema } from "graphql-yoga";
import _ from "lodash";
import { typeDef as hello, resolvers as helloResolvers } from "./hello.js";
import { typeDef as categories, resolvers as categoriesResolvers } from "./categories.js";
import { typeDef as products, resolvers as productsResolvers } from "./products.js";
import { typeDef as authentication, resolvers as authenticationResolvers } from "./authentication.js";
import { typeDef as upload, resolvers as uploadResolvers } from "./upload.js";

const query = `
  type Query {
    _empty: String
  }
  
  type Mutation {
    _emptyAction: String
  }
`;

const typeDefs = [query, hello,  categories, products, authentication, upload];
const resolvers = _.merge(
  helloResolvers, 
  categoriesResolvers,
  productsResolvers,
  authenticationResolvers,
  uploadResolvers
);

export const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});