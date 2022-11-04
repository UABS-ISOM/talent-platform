import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import type { User } from "firebase/auth";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_SERVER,
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

/**
 * Changes the authorisation header sent with every request.
 * @param user The authenticated user.
 */
export const setToken = async (user: User | null) => {
  const token = await user?.getIdToken();

  apolloClient.setLink(
    createHttpLink({
      uri: import.meta.env.VITE_GRAPHQL_SERVER,
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    })
  );
};
