import { createRouter, createWebHistory } from "vue-router";
import { useAreaStore } from "@/stores/locallocal/area.js";
import Map from "@/views/map/index.vue";

const routes = [
  {
    path: "/",
    redirect: "/area/DeafultAreaMap",
  },
  {
    path: "/area/:nazwa",
    name: "Dashboard Map",
    component: Map,
    beforeEnter: (to) => {
      const mapStore = useAreaStore();
      mapStore.setAreaName(to.params.nazwa);
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
