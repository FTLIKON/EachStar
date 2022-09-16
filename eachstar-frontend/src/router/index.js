import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/main",
      name: "main",
      component: () =>
        import(/* webpackChunkName: "login" */ "../components/top-nav.vue"),
    },
    {
      path: "/reg",
      name: "reg",
      component: () =>
        import(/* webpackChunkName: "login" */ "../components/register.vue"),
    },
  ],
});

export default router;
