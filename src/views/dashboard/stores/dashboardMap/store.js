import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboardMap", {
  state: () => ({
    rightPanelCollapsed: false,
    rightPanelWidth: 380,
    mapCenter: [0, 0],
    mapZoom: 10,
  }),

  actions: {
    toggleRightPanel() {
      this.rightPanelCollapsed = !this.rightPanelCollapsed;
    },

    setRightPanelWidth(width) {
      this.rightPanelWidth = width;
    },

    setMapCenter(center) {
      this.mapCenter = center;
    },

    setMapZoom(zoom) {
      this.mapZoom = zoom;
    },
  },
});
