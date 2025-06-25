// import client from "@/services/communication/http-client.js";
import { generateRobots } from "./mockData.js";

export const robotsControler = {
  async getAllRobots() {
    return generateRobots(1);
  },
};
