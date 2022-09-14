import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () =>
        import(/* webpackChunkName: "login" */ "../views/Login/index.vue"),
    },
    {
      path: "/main",
      name: "main",
      component: () =>
        import(/* webpackChunkName: "login" */ "../components/top-nav.vue"),
    }
  ],
});

export default router;
