import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/main.vue";
import Test from "../views/auth.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: Main,
    },
    {
      path: "/test",
      name: "test",
      component: Test,
    },
  ],
});

export default router;
