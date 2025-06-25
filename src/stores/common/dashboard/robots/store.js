import { robotsControler } from "@/http-clients/dashboard/robots/controler.js";
import { defineStore } from "pinia";
import { findShortestPath, getRandomPointIds } from "./services/pathfinding.js";

export const useRobotStore = defineStore("dashboard-robots", {
  state: () => ({
    robots: [],
    robotPaths: {}, // { robotId: [pointIds] }
  }),

  getters: {
    getRobotPath: (state) => (robotId) => {
      return state.robotPaths[robotId] || [];
    },
  },

  actions: {
    async getAllRobots() {
      this.robots = await robotsControler.getAllRobots();
    },

    generatePathsForAllRobots(mapPoints, transitions) {
      if (!mapPoints || !transitions || mapPoints.length < 2) {
        console.warn("Insufficient data for path generation");
        return;
      }
      this.robots.forEach((robot) => {
        const path = this.generateRandomPath(mapPoints, transitions);
        if (path.length > 0) {
          this.robotPaths[robot.id] = path;
        }
      });
    },

    generateRandomPath(mapPoints, transitions) {
      const [startId, endId] = getRandomPointIds(mapPoints, 2);

      if (!startId || !endId) {
        return [];
      }

      return findShortestPath(startId, endId, transitions);
    },

    updateRobotPath(robotId, path) {
      this.robotPaths[robotId] = path;
    },

    clearAllPaths() {
      this.robotPaths = {};
    },
  },
});
