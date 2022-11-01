import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "App",
      component: () => import("@/components/AppView.vue"),
    },

    // Authentication pages
    {
      path: "/auth",
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
  ],
});

export default router;
