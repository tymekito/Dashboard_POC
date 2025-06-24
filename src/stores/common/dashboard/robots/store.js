import { robotsControler } from "@/http-clients/dashboard/robots/controler.js";
import { defineStore } from "pinia";

export const useRobotStore = defineStore("dashboard-robots", {
  state: () => ({
    robots: [],
  }),

  actions: {
    async getAllRobots() {
      this.robots = await robotsControler.getAllRobots();
    },
  },
});
