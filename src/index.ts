import { ApolloServer } from "apollo-server";
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { Query } from "./resolvers";
import { typeDefs } from "./schema/schema";

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
  },
  context: {},
  plugins: [
    ApolloServerPluginLandingPageDisabled(),
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

server.listen().then(({ url }) => {
  console.log(`Your Server is running at ${url}`);
});

