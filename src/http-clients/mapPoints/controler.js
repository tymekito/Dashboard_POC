import client from "@/services/communication/http-client";

export const mapPointsController = {
  async getAreaMapPoints(areaName) {
    const response = await client.get("external/facility/area", { areaName: areaName });
    return response.data;
  },
};
