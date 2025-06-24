import { defineStore } from "pinia";

export const useLoaderStore = defineStore("loader", {
  state: () => ({
    pendingRequestCount: 0,
    shouldDisplayLoader: true,
    displaySuccessMessage: true,
  }),

  getters: {
    displayLoader: (state) => state.shouldDisplayLoader && state.pendingRequestCount > 0,
  },

  actions: {
    clearAllData() {
      this.pendingRequestCount = 0;
      this.shouldDisplayLoader = true;
      this.displaySuccessMessage = true;
    },
    incrementPendingRequestCount() {
      this.pendingRequestCount++;
    },
    decrementPendingRequestCount() {
      this.pendingRequestCount--;
    },
    setLoaderVisibility(data) {
      this.shouldDisplayLoader = data;
    },
    setSuccessMessageVisibility(data) {
      this.displaySuccessMessage = data;
    },
  },
});
