<template>
  <div class="left-panel-container">
    <div ref="robotsList" class="robots-list">
      <RobotTile v-for="robot in robots" :key="robot.id" :robot="robot" :width="tileWidth" :height="tileHeight" />
    </div>
  </div>
</template>

<script>
import RobotTile from "./components/RobotTile.vue";
import { LAYOUT_CONFIG } from "./constants.js";
import { generateRobots } from "./files/mockData.js";

export default {
  name: "LeftPanel",
  components: {
    RobotTile,
  },

  data() {
    return {
      robots: [],
      dimensions: {
        height: 0,
        width: 0,
      },
      resizeObserver: null,
      minTileHeight: LAYOUT_CONFIG.MIN_TILE_HEIGHT,
      maxTileHeight: LAYOUT_CONFIG.MAX_TILE_HEIGHT,
    };
  },

  computed: {
    tileHeight() {
      return this.layoutData.tileHeight;
    },

    tileWidth() {
      const { columns } = this.layoutData;
      const columnGap = columns > 1 ? LAYOUT_CONFIG.TILE_GAP : 0;
      return (this.dimensions.width - columnGap) / columns;
    },

    layoutData() {
      const { height } = this.dimensions;
      const robotCount = this.robots.length;

      if (!robotCount || !height) {
        return this.getDefaultLayout();
      }

      return this.calculateOptimalLayout(robotCount, height);
    },
  },

  methods: {
    getDefaultLayout() {
      return {
        tileHeight: this.maxTileHeight,
        columns: 1,
      };
    },

    calculateOptimalLayout(robotCount, availableHeight) {
      const maxColumns = Math.min(LAYOUT_CONFIG.MAX_COLUMNS, Math.ceil(robotCount / 2));

      for (let columns = 1; columns <= maxColumns; columns++) {
        const layout = this.tryLayoutWithColumns(robotCount, availableHeight, columns);
        if (layout) return layout;
      }

      return this.getDefaultLayout();
    },

    tryLayoutWithColumns(robotCount, availableHeight, columns) {
      const tilesPerColumn = Math.ceil(robotCount / columns);
      const requiredHeight = this.calculateRequiredHeight(tilesPerColumn);

      if (requiredHeight > availableHeight) {
        return null;
      }

      const tileHeight = this.calculateTileHeight(availableHeight, tilesPerColumn);
      return { tileHeight, columns };
    },

    calculateRequiredHeight(tilesPerColumn) {
      return tilesPerColumn * (this.minTileHeight + LAYOUT_CONFIG.TILE_GAP);
    },

    calculateTileHeight(availableHeight, tilesPerColumn) {
      const maxPossibleHeight = (availableHeight - tilesPerColumn * LAYOUT_CONFIG.TILE_GAP) / tilesPerColumn;
      return Math.max(this.minTileHeight, Math.min(maxPossibleHeight, LAYOUT_CONFIG.MAX_TILE_HEIGHT));
    },

    updateDimensions() {
      this.$nextTick(() => {
        const container = this.$refs.robotsList;
        if (!container) return;

        this.dimensions = {
          height: container.clientHeight,
          width: container.clientWidth,
        };
        this.minTileHeight = Math.max(
          container.clientHeight / LAYOUT_CONFIG.DYNAMIC_HEIGHT_DIVIDER - LAYOUT_CONFIG.TILE_GAP,
          LAYOUT_CONFIG.MIN_TILE_HEIGHT,
        );
      });
    },

    initializeResizeObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateDimensions();
      });

      if (this.$refs.robotsList) {
        this.resizeObserver.observe(this.$refs.robotsList);
      }
    },
  },

  mounted() {
    this.robots = generateRobots(LAYOUT_CONFIG.AMOUNT_OF_ROBOTS);
    this.updateDimensions();
    this.initializeResizeObserver();
  },

  beforeUnmount() {
    this.resizeObserver?.disconnect();
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

$tileGap: 0.6rem;
.left-panel-container {
  height: 100%;
}

.robots-list {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: $tileGap;
  align-items: flex-start;
}
</style>
