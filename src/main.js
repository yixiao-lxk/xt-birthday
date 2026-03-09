/*
 * @Description  : 只是一个描述
 * @Version      : 1.0
 * @Author       : 476782900@qq.com
 * @Date         : 2026-01-13 15:27:58
 * @LastEditors  : chen
 * @LastEditTime : 2026-01-22 17:46:38
 * @FilePath     : \xingtie\src\main.js
 * Copyright (C) 2026 chen. All rights reserved.
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Message, Dialog } from "element-ui";
// 开发环境下引入mock
// if (process.env.NODE_ENV === "development") {
  require("./mock");
// }
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.use(Dialog);

// 初始化biliSDK环境
if (window.biliBridge) {
  const { initEnv } = window.biliBridge;
  if (initEnv) {
    initEnv();
  }
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
