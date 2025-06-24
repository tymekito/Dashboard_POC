import { missionController } from "@/http-clients/dashboard/missions/controler.js";
import { defineStore } from "pinia";

export const useMissionStore = defineStore("dashboard-missions", {
  state: () => ({
    missions: [],
  }),

  actions: {
    async getAllMissions() {
      this.missions = await missionController.getAllMissions();
    },
  },
});
