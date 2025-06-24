import { createRouter, createWebHistory } from "vue-router";
import { useAreaDataStore } from "@/stores/common/areaData/store.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/selector",
    },
    {
      path: "/selector",
      name: "DashboardSelector",
      component: () => import("@/views/dashboadSelector/index.vue"),
    },
    {
      path: "/area/:name",
      name: "DashboardMap",
      component: () => import("@/views/dashboard/index.vue"),
      beforeEnter: (to) => {
        const areaDataStore = useAreaDataStore();
        areaDataStore.setAreaName(to.params.name);
      },
    },
  ],
});

export default router;
