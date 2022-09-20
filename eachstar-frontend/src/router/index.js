import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "/",
      component: () =>
        import("../components/top-nav.vue"),
    },
  ],
});

export default router;
