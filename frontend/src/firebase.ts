import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
  onIdTokenChanged,
} from "firebase/auth";
import { useMainStore } from "@/mainStore";
import router, { findCorrectedRoute } from "./router";
import { apolloClient } from "./gql";

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
  if (auth.currentUser === null) apolloClient.cache.reset();

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
