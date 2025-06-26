import AreaMapPoints from "@/models/area/AreaMapPoints.js";
import client from "@/services/communication/http-client";

export const mapPointsController = {
  async getAreaMapPoints(areaName) {
    const response = await client.get("external/facility/area", { areaName: areaName });
    return new AreaMapPoints(response.data);
  },
};
