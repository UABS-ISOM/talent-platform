import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import type { Context } from './context';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { getUser } from './utils/auth';
import { DataLoaders } from './dataLoaders';
import { getFirestore } from 'firebase-admin/firestore';
import { indexUser } from './utils/algoliaSync';

// Ensure that the Firebase Admin SDK is initialised
initializeApp();

const expressServer = express();

// Start Apollo server
const httpServer = http.createServer(expressServer);
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,

  // eslint-disable-next-line new-cap
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

/**
 * Handles a Functions request, ensuring that the Apollo server is attached to the Express server.
 * @param req The Express request.
 * @param res The Express response.
 * @returns The express server.
 */
const handleRequest = async (
  req: functions.https.Request,
  res: functions.Response
) => {
  try {
    await server.start();

    // Add Apollo middleware to express server
    expressServer.use(
      '/',
      cors<cors.CorsRequest>(),
      json(),
      expressMiddleware(server, {
        context: async ({ req }): Promise<Context> => {
          const user = req.headers.authorization
            ? await getUser(req.headers.authorization)
            : undefined;

          // Initialise dataLoaders
          const firestore = getFirestore();

          return {
            user,
            dataLoaders: new DataLoaders(firestore),
          };
        },
      })
    );
  } catch (error) {
    console.log('Function already initialised');
  }

  return expressServer(req, res);
};

// Export express server as a Cloud Function
export const graphql = functions
  .region('australia-southeast1')
  .https.onRequest(handleRequest);

// Add a user doc when created
export const onUserCreated = functions.auth
  .user()
  .onCreate(async ({ uid, displayName }) => {
    const data = displayName ? { displayName } : {};

    const firestore = getFirestore();
    await Promise.all([
      firestore.collection('users').doc(uid).set(data),
      indexUser(uid),
    ]);
  });

// Delete a user's records when deleted
// TODO: implement
// export const onUserDeleted = functions.auth.user().onDelete(() => {});
