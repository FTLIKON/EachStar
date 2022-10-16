import { createRouter, createWebHashHistory } from "vue-router";
import mygithub from "../views/mygithub.vue";
import github from "../views/github.vue";
import mygitee from "../views/mygitee.vue";
import gitee from "../views/gitee.vue";
import phonehome from "../views/phone-home.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: "/phone-home",
      name: "phone-home",
      component: phonehome,
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
    {
      path: "/gitee",
      name: "gitee",
      component: gitee,
      meta: {
        title: "EachStar",
      },
    },
    {
      path: "/mygitee",
      name: "mygitee",
      component: mygitee,
      meta: {
        title: "EachStar",
      },
    },
  ],
});

export default router;
