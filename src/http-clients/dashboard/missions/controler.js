// import client from "@/services/communication/http-client.js";
import { generateMissions } from "./mockData.js";

export const missionController = {
  async getAllMissions() {
    return generateMissions(8);
  },
};
