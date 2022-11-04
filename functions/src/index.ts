import * as functions from 'firebase-functions';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

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
