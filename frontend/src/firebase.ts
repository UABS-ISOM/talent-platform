import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
} from "firebase/auth";
import { useMainStore } from "@/mainStore";
import router, { findCorrectedRoute } from "./router";
import { apolloClient } from "./gql";
import { provideApolloClient, useMutation } from "@vue/apollo-composable";
import { graphql } from "./gql/__generated__";
import { Notify } from "quasar";
import type { GraphQLError } from "graphql";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

// Update the auth state when the user changes
onAuthStateChanged(auth, async () => {
  if (auth.currentUser === null) {
    // Clear user data
    apolloClient.cache.reset();

    const mainStore = useMainStore();
    mainStore.userClaims = undefined;
  } else {
    generateClaims();
  }

  // Update main store with user information
  const mainStore = useMainStore();
  mainStore.userLoaded = true;

  // Determine if route needs to be changed
  const redirect = findCorrectedRoute();
  if (redirect) await router.replace(redirect);
});

// Connect to the emulators if we're in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

/**
 * Requests the server to generate token claims, such as staff.
 */
export const generateClaims = async () => {
  // Ask server to generate claims
  provideApolloClient(apolloClient);
  const { mutate } = useMutation(
    graphql(`
      mutation GenerateClaimsMutation {
        generateClaims {
          staff
        }
      }
    `)
  );

  try {
    // Update main store with user information
    await mutate();
    const mainStore = useMainStore();
    mainStore.userClaims = (
      await auth.currentUser?.getIdTokenResult(true)
    )?.claims;
  } catch (e) {
    // An error occurred in generating claims

    // Ensure error not due to unverified email
    if (
      ((e as any)?.graphQLErrors as GraphQLError[] | undefined)?.every(
        (error) => error?.extensions?.code !== "UNVERIFIED"
      )
    )
      Notify.create({
        message:
          "An error occurred when verifying your permissions with the server. Please check your connection and try again later.",
        progress: true,
        type: "negative",
        icon: "mdi-alert",
      });
  }
};
