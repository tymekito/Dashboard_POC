import { createApp } from "vue";
import "@/assets/styles/index.scss";
import router from "@/router";
import { createPinia } from "pinia";
import App from "./App.vue";
import { vuetify } from "./plugins/vuetify";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
