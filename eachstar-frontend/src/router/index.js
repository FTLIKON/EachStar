import { createRouter, createWebHistory } from "vue-router";
import mygithub from "../views/mygithub.vue";
import github from "../views/github.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: github,
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
    {
      path: "/mygithub",
      name: "mygithub",
      component: mygithub,
      meta: {
        title: "EachStar",
      },
    },
  ],
});

export default router;
