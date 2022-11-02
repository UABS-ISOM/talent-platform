import * as functions from 'firebase-functions';
import { ApolloServer, gql } from 'apollo-server-cloud-functions';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  // eslint-disable-next-line new-cap
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

export const graphql = functions
  .region('australia-southeast1')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .https.onRequest(server.createHandler() as any);
