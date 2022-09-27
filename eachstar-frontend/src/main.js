import { createApp } from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import axios from "axios";
import mitt from "mitt"
axios.defaults.withCredentials = true; //让ajax携带cookie

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

const app = createApp(App);
app.config.globalProperties.$bus = mitt();
app.use(VueCookies);
app.use(router);
app.use(ElementPlus);
app.mount("#app");