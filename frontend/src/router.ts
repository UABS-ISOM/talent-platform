import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "App",
      component: () => import("@/components/AppView.vue"),
    },
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
      ],
    },
  ],
});

export default router;
