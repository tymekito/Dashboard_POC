<template>
  <div class="map-container">
    <!-- Left Panel -->
    <div
      class="side-panel left-panel"
      :class="{ collapsed: dashboardStore.leftPanelCollapsed, resizing: isResizing && currentPanel === 'left' }"
      :style="{ width: leftPanelWidth }"
    >
      <div class="panel-content" v-if="!dashboardStore.leftPanelCollapsed">
        <LeftPanel />
      </div>
      <PanelCollapseButton
        v-if="!isResizing"
        :is-collapsed="dashboardStore.leftPanelCollapsed"
        side="left"
        @toggle="dashboardStore.toggleLeftPanel"
      />
      <ResizeHandle
        v-if="!dashboardStore.leftPanelCollapsed"
        side="right"
        @start-resize="(e) => startResize(e, 'left')"
      />
    </div>

    <!-- Map Area -->
    <div class="map-area">
      <MapContent v-if="areaDataStore.areaName && areaDataStore.areaMapPoints?.spots" />
    </div>

    <!-- Right Panel -->
    <div
      class="side-panel right-panel"
      :class="{ collapsed: dashboardStore.rightPanelCollapsed, resizing: isResizing && currentPanel === 'right' }"
      :style="{ width: rightPanelWidth }"
    >
      <div class="panel-content" v-if="!dashboardStore.rightPanelCollapsed">
        <RightPanel />
      </div>
      <PanelCollapseButton
        v-if="!isResizing"
        :is-collapsed="dashboardStore.rightPanelCollapsed"
        side="right"
        @toggle="dashboardStore.toggleRightPanel"
      />
      <ResizeHandle
        v-if="!dashboardStore.rightPanelCollapsed"
        side="left"
        @start-resize="(e) => startResize(e, 'right')"
      />
    </div>
  </div>
</template>

<script>
import { useAreaDataStore } from "@/stores/common/dashboard/areaData/store.js";
import LeftPanel from "./components/LeftPanel/index.vue";
import MapContent from "./components/MapContent/index.vue";
import RightPanel from "./components/RightPanel/index.vue";
import PanelCollapseButton from "./mixins/PanelCollapseButton/index.vue";
import ResizeHandle from "./mixins/ResizeHandle/index.vue";
import { useDashboardStore } from "./stores/dashboardMap/store.js";

export default {
  name: "DashboardMap",
  components: {
    MapContent,
    LeftPanel,
    RightPanel,
    PanelCollapseButton,
    ResizeHandle,
  },

  setup() {
    return {
      areaDataStore: useAreaDataStore(),
      dashboardStore: useDashboardStore(),
    };
  },
  data: () => ({
    isResizing: false,
    startX: 0,
    startWidth: 0,
    currentPanel: null,
  }),

  computed: {
    leftPanelWidth() {
      return this.dashboardStore.leftPanelCollapsed ? "2.5rem" : `${this.dashboardStore.leftPanelWidth}px`;
    },
    rightPanelWidth() {
      return this.dashboardStore.rightPanelCollapsed ? "2.5rem" : `${this.dashboardStore.rightPanelWidth}px`;
    },
  },

  async mounted() {
    document.addEventListener("mousemove", this.doResize, { passive: true });
    document.addEventListener("mouseup", this.stopResize);
    await this.areaDataStore.getAreaMapPoints(this.areaDataStore.areaName);
  },

  beforeUnmount() {
    document.removeEventListener("mousemove", this.doResize);
    document.removeEventListener("mouseup", this.stopResize);
  },

  methods: {
    startResize(event, panel) {
      this.isResizing = true;
      this.currentPanel = panel;
      this.startX = event.clientX;
      this.startWidth = panel === "left" ? this.dashboardStore.leftPanelWidth : this.dashboardStore.rightPanelWidth;

      this.setResizingState(true);
      event.preventDefault();
    },

    doResize(event) {
      if (!this.isResizing) return;

      requestAnimationFrame(() => {
        const deltaX = event.clientX - this.startX;
        const newWidth = this.currentPanel === "left" ? this.startWidth + deltaX : this.startWidth - deltaX;

        const clampedWidth = Math.max(200, Math.min(600, newWidth));

        if (this.currentPanel === "left") {
          this.dashboardStore.setLeftPanelWidth(clampedWidth);
        } else {
          this.dashboardStore.setRightPanelWidth(clampedWidth);
        }
      });
    },

    stopResize() {
      if (!this.isResizing) return;

      this.isResizing = false;
      this.currentPanel = null;
      this.setResizingState(false);
    },

    setResizingState(isResizing) {
      document.body.style.userSelect = isResizing ? "none" : "";
      document.body.style.cursor = isResizing ? "col-resize" : "";
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;
@use "@/assets/styles/abstracts/_sizes.scss" as sizes;

.map-container {
  display: flex;
  height: calc(100dvh - sizes.$header);
  background-color: colors.$darkBlue;
}

.side-panel {
  font-size: 1.2rem;
  height: calc(100% - 1rem) !important;
  background: linear-gradient(135deg, colors.$darkBlue 0%, colors.$darkBlue 100%);
  border: 0.125rem solid colors.$lightBlue;
  border-radius: 0.5rem;
  margin: 0.5rem;
  position: relative;
  transition: width 0.1s ease-out;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.3);

  &.collapsed {
    width: 2.5rem !important;
    min-width: 2.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.resizing {
    transition: none !important;
  }
}

.left-panel {
  order: 1;
  margin-right: 0.25rem;
  height: inherit;
}

.right-panel {
  order: 3;
  margin-left: 0.25rem;
}

.panel-content {
  padding: 0.75rem;
  color: colors.$white;
  height: 100%;
}

.map-area {
  flex: 1;
  border: 0.125rem solid colors.$lightBlue;
  border-radius: 0.5rem;
  margin: 0.5rem 0.25rem;
  order: 2;
  overflow: hidden;
}
</style>
