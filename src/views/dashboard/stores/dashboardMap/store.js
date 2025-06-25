import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboardMap", {
  state: () => ({
    leftPanelCollapsed: true,
    rightPanelCollapsed: true,
    leftPanelWidth: 380,
    rightPanelWidth: 380,
    mapCenter: [0, 0],
    mapZoom: 10,
  }),

  actions: {
    toggleLeftPanel() {
      this.leftPanelCollapsed = !this.leftPanelCollapsed;
    },

    toggleRightPanel() {
      this.rightPanelCollapsed = !this.rightPanelCollapsed;
    },

    setLeftPanelWidth(width) {
      this.leftPanelWidth = width;
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
