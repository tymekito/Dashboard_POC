import { ref } from "vue";
import { mapPointsController } from "@/http-clients/mapPoints/controler.js";
import { defineStore } from "pinia";

export const useMapPointsStore = defineStore("mapPoints", () => {
  const facilityData = ref(null);
  const loading = ref(false);

  async function fetchFacilityArea(areaName) {
    loading.value = true;
    try {
      facilityData.value = await mapPointsController.getAreaMapPoints("Polipak");
    } finally {
      loading.value = false;
    }
  }

  return {
    facilityData,
    loading,
    fetchFacilityArea,
  };
});
