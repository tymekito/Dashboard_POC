import { mapPointsController } from "@/http-clients/mapPoints/controler.js";
import { defineStore } from "pinia";

export const useAreaDataStore = defineStore("area", {
  state: () => ({
    areaName: "",
    areaMapPoints: null,
  }),

  actions: {
    async getAreaMapPoints(areaName) {
      this.areaMapPoints = await mapPointsController.getAreaMapPoints(areaName);
    },
    setAreaName(name) {
      this.areaName = name;
    },

    clearAreaName() {
      this.areaName = "";
    },
  },
});
