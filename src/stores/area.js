import { ref } from "vue";
import { defineStore } from "pinia";

export const useAreaStore = defineStore("area", () => {
  // Area state
  const areaName = ref("");

  // Area actions
  function setAreaName(name) {
    areaName.value = name;
  }

  function clearAreaName() {
    areaName.value = "";
  }

  return {
    areaName,
    setAreaName,
    clearAreaName,
  };
});
