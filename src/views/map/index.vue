<template>
  <div class="map-container">
    <div
      class="side-panel left-panel"
      :class="{
        collapsed: mapStore.leftPanelCollapsed,
        resizing: isResizing && currentPanel === 'left',
      }"
      :style="{ width: mapStore.leftPanelCollapsed ? '40px' : mapStore.leftPanelWidth + 'px' }"
    >
      <div class="panel-header">
        <span v-if="!mapStore.leftPanelCollapsed" class="panel-title">Left Panel</span>
      </div>
      <div class="panel-content" v-if="!mapStore.leftPanelCollapsed">
        <LeftPanel />
      </div>
      <div
        class="collapse-trigger-area"
        @mouseenter="showCollapseButton = 'left'"
        @mouseleave="showCollapseButton = null"
      >
        <button
          class="collapse-button"
          @click="mapStore.toggleLeftPanel"
          v-show="showCollapseButton === 'left' && !isResizing"
        >
          {{ !mapStore.leftPanelCollapsed ? "◀" : "▶" }}
        </button>
      </div>
      <div
        v-if="!mapStore.leftPanelCollapsed"
        class="resize-handle right-handle"
        @mousedown="startResize($event, 'left')"
      ></div>
    </div>

    <div class="map-area">
      <MapContent v-if="mapPointsStore.facilityData && areaStore.areaName" />
    </div>

    <div
      class="side-panel right-panel"
      :class="{
        collapsed: mapStore.rightPanelCollapsed,
        resizing: isResizing && currentPanel === 'right',
      }"
      :style="{ width: mapStore.rightPanelCollapsed ? '40px' : mapStore.rightPanelWidth + 'px' }"
    >
      <div class="panel-header">
        <span v-if="!mapStore.rightPanelCollapsed" class="panel-title">Right Panel</span>
      </div>
      <div class="panel-content" v-if="!mapStore.rightPanelCollapsed">
        <RightPanel />
      </div>
      <div
        class="collapse-trigger-area"
        @mouseenter="showCollapseButton = 'right'"
        @mouseleave="showCollapseButton = null"
      >
        <button
          class="collapse-button"
          @click="mapStore.toggleRightPanel"
          v-show="showCollapseButton === 'right' && !isResizing"
        >
          {{ !mapStore.rightPanelCollapsed ? "▶" : "◀" }}
        </button>
        <div
          v-if="!mapStore.rightPanelCollapsed"
          class="resize-handle left-handle"
          @mousedown="startResize($event, 'right')"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMapPointsStore } from "@/stores/external/mapPoints.js";
import { useAreaStore } from "@/stores/local/area";
import { useMapStore } from "@/stores/local/map.js";
import LeftPanel from "./components/LeftPanel/index.vue";
import MapContent from "./components/MapContent/index.vue";
import RightPanel from "./components/RightPanel/index.vue";

export default {
  name: "Map",
  components: {
    MapContent,
    LeftPanel,
    RightPanel,
  },
  setup() {
    const mapStore = useMapStore();
    const areaStore = useAreaStore();
    const mapPointsStore = useMapPointsStore();
    return { areaStore, mapStore, mapPointsStore };
  },
  async mounted() {
    await this.mapPointsStore.fetchFacilityArea("Polipak");
  },
  data() {
    return {
      isResizing: false,
      startX: 0,
      startWidth: 0,
      currentPanel: null,
      showCollapseButton: null,
    };
  },
  methods: {
    startResize(event, panel) {
      this.isResizing = true;
      this.currentPanel = panel;
      this.startX = event.clientX;
      this.startWidth = panel === "left" ? this.mapStore.leftPanelWidth : this.mapStore.rightPanelWidth;

      // Ukryj przycisk collapse podczas resizowania
      this.showCollapseButton = null;

      // Wyłącz transitions podczas resizowania
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      document.addEventListener("mousemove", this.doResize, { passive: true });
      document.addEventListener("mouseup", this.stopResize);
      event.preventDefault();
    },
    doResize(event) {
      if (!this.isResizing) return;

      // Użyj requestAnimationFrame dla płynności
      requestAnimationFrame(() => {
        const deltaX = event.clientX - this.startX;
        let newWidth;

        if (this.currentPanel === "left") {
          newWidth = this.startWidth + deltaX;
          this.mapStore.setLeftPanelWidth(Math.max(200, Math.min(600, newWidth)));
        } else if (this.currentPanel === "right") {
          newWidth = this.startWidth - deltaX;
          this.mapStore.setRightPanelWidth(Math.max(200, Math.min(600, newWidth)));
        }
      });
    },
    stopResize() {
      this.isResizing = false;
      this.currentPanel = null;

      // Przywróć domyślne style
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      document.removeEventListener("mousemove", this.doResize);
      document.removeEventListener("mouseup", this.stopResize);
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
  background: linear-gradient(135deg, colors.$darkBlue 0%, colors.$darkBlue, 100%);
  border: 2px solid colors.$lightBlue;
  border-radius: 8px;
  margin: 8px;
  position: relative;
  transition: width 0.1s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &.collapsed {
    width: 40px !important;
    min-width: 40px;
    border: 2px solid colors.$lightBlue;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.resizing {
    transition: none !important;
  }

  .panel-header {
    height: 60px;
    border-bottom: 2px solid colors.$lightBlue;
    background: rgba(colors.$lightBlue, 0.1);
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-radius: 6px 6px 0 0;

    .panel-title {
      color: colors.$white;
      font-weight: 600;
      font-size: 16px;
    }
  }

  .panel-content {
    padding: 20px;
    color: colors.$white;
  }
}

.left-panel {
  order: 1;
  margin-right: 4px;
}

.right-panel {
  order: 3;
  margin-left: 4px;
}

.map-area {
  flex: 1;
  border: 2px solid colors.$lightBlue;
  border-radius: 8px;
  margin: 8px 4px;
  order: 2;
  position: relative;
  overflow: hidden;
}

.collapse-trigger-area {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20px;
  z-index: 20;

  .collapse-button {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    background: colors.$lightBlue;
    border: 2px solid colors.$white;
    color: colors.$white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &:hover {
      background: colors.$lightBlue;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 154, 190, 0.6);
    }

    &:active {
      transform: translateY(-50%) scale(0.95);
    }
  }
}

.left-panel .collapse-trigger-area {
  right: -10px;

  .collapse-button {
    right: -5px;
  }
}

.right-panel .collapse-trigger-area {
  left: -10px;

  .collapse-button {
    left: -3px;
  }
}

.resize-handle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 80px;
  cursor: col-resize;
  background: colors.$lightBlue;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.7;
  z-index: 999;

  &:hover {
    background: colors.$lightBlue;
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 154, 190, 0.5);
  }

  &.right-handle {
    right: -6px;
  }

  &.left-handle {
    left: 3px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 30px;
    background: colors.$white;
    border-radius: 2px;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }
}
</style>
