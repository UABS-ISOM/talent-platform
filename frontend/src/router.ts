import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "App",
      component: () => import("@/components/AppView.vue"),
    },
  ],
});

export default router;
