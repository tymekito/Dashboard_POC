import { createApp } from "vue";
import "@/assets/styles/index.scss";
import i18n from "@/plugins/i18n.js";
import { registerNotifications } from "@/plugins/notification-plugin.js";
import router from "@/router";
import { createHTTPClientInstance } from "@/services/communication/http-client.js";
import { createPinia } from "pinia";
import App from "./App.vue";
import { loadConfig } from "./app.config.js";
import { vuetify } from "./plugins/vuetify";

const app = createApp(App);

loadConfig()
  .then(() => app.use(createPinia()))
  .then(() => registerNotifications(app))
  .then(() => app.use(router))
  .then(() => app.use(vuetify))
  .then(() => app.use(i18n))
  .then(() => createHTTPClientInstance())
  .then(() => app.mount("#app"));
