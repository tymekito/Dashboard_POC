import { ref } from "vue";
import { defineStore } from "pinia";

export const useMapStore = defineStore("map", () => {
  // Panel states
  const leftPanelCollapsed = ref(false);
  const rightPanelCollapsed = ref(false);

  // Panel widths
  const leftPanelWidth = ref(300);
  const rightPanelWidth = ref(300);

  // Panel actions
  function toggleLeftPanel() {
    leftPanelCollapsed.value = !leftPanelCollapsed.value;
  }

  function toggleRightPanel() {
    rightPanelCollapsed.value = !rightPanelCollapsed.value;
  }

  function setLeftPanelWidth(width) {
    leftPanelWidth.value = width;
  }

  function setRightPanelWidth(width) {
    rightPanelWidth.value = width;
  }

  // Map state (możesz rozszerzyć później)
  const mapCenter = ref([0, 0]);
  const mapZoom = ref(10);

  function setMapCenter(center) {
    mapCenter.value = center;
  }

  function setMapZoom(zoom) {
    mapZoom.value = zoom;
  }

  return {
    leftPanelCollapsed,
    rightPanelCollapsed,
    leftPanelWidth,
    rightPanelWidth,
    mapCenter,
    mapZoom,
    toggleLeftPanel,
    toggleRightPanel,
    setLeftPanelWidth,
    setRightPanelWidth,
    setMapCenter,
    setMapZoom,
  };
});
