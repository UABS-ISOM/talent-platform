import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from "vue-router";
import { useMainStore } from "@/mainStore";
import { getAuth } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      meta: {
        requiresAuth: true,
        requiresVerification: true,
      },
      component: () => import("@/components/Chat/ChatLayout.vue"),
      children: [
        {
          path: "",
          name: "Chat",
          component: () => import("@/components/Chat/ChatView.vue"),
        },
      ],
    },

    // Individual account actions
    {
      path: "/actions",
      component: () => import("@/components/Auth/AuthLayout.vue"),
      children: [
        {
          path: "verifyemail",
          name: "ActionsVerifyEmail",
          meta: {
            requiresAuth: true,
            unverifiedOnly: true,
          },
          component: () =>
            import(
              "@/components/Actions/VerifyEmail/ActionsVerifyEmailView.vue"
            ),
        },
      ],
    },

    // Authentication pages
    {
      path: "/auth",
      meta: {
        unauthOnly: true,
      },
      component: () => import("@/components/Auth/AuthLayout.vue"),
      children: [
        {
          path: "",
          name: "Auth",
          component: () =>
            import("@/components/Auth/Select/AuthSelectView.vue"),
        },
        {
          path: "signup",
          name: "AuthSignUp",
          component: () =>
            import("@/components/Auth/SignUp/AuthSignUpView.vue"),
        },
        {
          path: "forgottenpassword",
          name: "AuthForgottenPassword",
          component: () =>
            import(
              "@/components/Auth/ForgottenPassword/AuthForgottenPasswordView.vue"
            ),
        },
      ],
    },
    {
      path: "/:catchAll(.*)*",
      component: () => import("@/components/404Error.vue"),
    },
  ],
});

// Route guard to ensure the user is authenticated
router.beforeEach((to) => {
  return findCorrectedRoute(to);
});

/**
 * Determines if the user is on a disallowed route, and redirect.
 * @param route The route to check, with the current route as default.
 * @returns The corrected route, or undefined if no correction is needed.
 */
export const findCorrectedRoute = (
  route: RouteLocationNormalized = router.currentRoute.value
) => {
  // Get user info
  const mainStore = useMainStore();
  if (!mainStore.userLoaded) return; // Function will be called again when the user is loaded
  const user = getAuth().currentUser;

  // User status checks
  const requiresAuth = route.matched.some((route) => route.meta.requiresAuth);
  const unauthOnly = route.matched.some((route) => route.meta.unauthOnly);

  if (requiresAuth && user === null) return { name: "Auth" };
  if (unauthOnly && user !== null) return { name: "Chat" };

  // Email verification checks
  const requiresVerification = route.matched.some(
    (route) => route.meta.requiresVerification
  );
  const unverifiedOnly = route.matched.some(
    (route) => route.meta.unverifiedOnly
  );

  if (requiresVerification && user !== null && !user?.emailVerified)
    return { name: "ActionsVerifyEmail" };
  if (unverifiedOnly && user !== null && user?.emailVerified)
    return { name: "Chat" };
};

export default router;
