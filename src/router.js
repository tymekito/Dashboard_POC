import { createRouter, createWebHistory } from "vue-router";
import Config from "@/app.config.js";
import { useAreaDataStore } from "@/stores/common/areaData/store.js";
import DashboardMap from "@/views/dashboard/index.vue";

const routes = [
  {
    path: "/",
    redirect: "/area",
  },
  {
    path: "/area",
    redirect: () => `/area/${Config.defaultArea()}`,
  },
  {
    path: "/area/:nazwa",
    name: "DashboardMap",
    component: DashboardMap,
    beforeEnter: (to) => {
      const areaDataStore = useAreaDataStore();
      areaDataStore.setAreaName(to.params.nazwa);
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
