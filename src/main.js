import { createApp } from "vue";
import "@/assets/styles/index.scss";
import { createPinia } from "pinia";
import App from "./App.vue";
import { vuetify } from "./plugins/vuetify";

const app = createApp(App);

app.use(createPinia());
app.use(vuetify);

app.mount("#app");
