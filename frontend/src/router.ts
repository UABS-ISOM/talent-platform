import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from "vue-router";
import { useMainStore } from "@/mainStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      meta: {
        requiresAuth: true,
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
  const user = mainStore.user;

  // Find correct route
  const requiresAuth = route.matched.some((route) => route.meta.requiresAuth);
  const unauthOnly = route.matched.some((route) => route.meta.unauthOnly);
  if (requiresAuth && user === null) return { name: "Auth" };
  if (unauthOnly && user !== null) return { name: "Chat" };
};

export default router;
