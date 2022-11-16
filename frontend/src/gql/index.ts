import {
  ApolloClient,
  from,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { getAuth } from "firebase/auth";

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: from([
    // Add auth token to headers
    setContext(async ({ headers }: Record<string, any>) => {
      const token = await getAuth().currentUser?.getIdToken();
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
          ...headers,
        },
      };
    }),

    // Create the http link
    createHttpLink({ uri: import.meta.env.VITE_GRAPHQL_SERVER }),
  ]),

  // Cache implementation
  cache: new InMemoryCache(),
});
