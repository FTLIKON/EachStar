import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-plus";
import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.mount("#app");

/**
 * popupLayout 弹出层相关
 */
import { show, hide } from "./components/popup-layout/script";
const pl = {
  show: show,
  hide: hide,
};
app.config.globalProperties.$PL = pl;
