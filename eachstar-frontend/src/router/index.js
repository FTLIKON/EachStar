import { createRouter, createWebHistory } from "vue-router";
import test from "../views/test.vue";
import github from "../views/github.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "gen",
      component: github,
      meta: {
        title: "EachStar",
      },
    },
    {
      path: "/test",
      name: "test",
      component: test,
      meta: {
        title: "EachStar",
      },
    },
    {
      path: "/github",
      name: "github",
      component: github,
      meta: {
        title: "EachStar",
      },
    },
  ],
});

export default router;
