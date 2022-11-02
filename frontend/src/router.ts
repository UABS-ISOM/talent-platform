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
          path: "confirminfo",
          name: "ActionsConfirmInfo",
          meta: {
            requiresAuth: true,
            unverifiedOnly: true,
          },
          component: () =>
            import("@/components/Actions/ActionsConfirmInfoView.vue"),
        },

        // Handle auth email actions
        {
          path: "emailhandler",
          name: "ActionsEmailHandler",
          beforeEnter: (to) => {
            switch (to.query.mode) {
              case "resetPassword":
                // Display reset password UI
                return { name: "ActionsResetPassword", query: to.query };
              case "recoverEmail":
                // Display email recovery UI
                return { name: "ActionsRecoverEmail", query: to.query };
              case "verifyEmail":
                // Display email verification UI
                return { name: "ActionsVerifyEmail", query: to.query };
              default:
                return "/";
            }
          },
          component: () =>
            import("@/components/Actions/ActionsEmailHandlerView.vue"),
        },

        {
          path: "resetpassword",
          name: "ActionsResetPassword",
          component: () =>
            import("@/components/Actions/ActionsResetPasswordView.vue"),
        },

        {
          path: "recoveremail",
          name: "ActionsRecoverEmail",
          component: () =>
            import("@/components/Actions/ActionsRecoverEmailView.vue"),
        },

        {
          path: "verifyemail",
          name: "ActionsVerifyEmail",
          component: () =>
            import("@/components/Actions/ActionsVerifyEmailView.vue"),
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
          component: () => import("@/components/Auth/AuthSignUpView.vue"),
        },

        {
          path: "forgottenpassword",
          name: "AuthForgottenPassword",
          component: () =>
            import("@/components/Auth/AuthForgottenPasswordView.vue"),
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
    return { name: "ActionsConfirmInfo" };
  if (unverifiedOnly && user !== null && user?.emailVerified)
    return { name: "Chat" };
};

export default router;
