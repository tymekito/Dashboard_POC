<template>
  <div class="left-panel-container">
    <div ref="robotsList" class="robots-list">
      <RobotTile v-for="robot in robots" :key="robot.id" :robot="robot" :width="tileWidth" :height="tileHeight" />
    </div>
  </div>
</template>

<script>
import RobotTile from "./components/RobotTile.vue";
import { generateRobots } from "./files/mockData.js";

export default {
  name: "LeftPanel",
  components: {
    RobotTile,
  },

  data() {
    return {
      robots: null,
      availableHeight: 0,
      availableWidth: 0,
      resizeObserver: null,
      minTileHeightInPx: 75,
    };
  },

  computed: {
    layoutCalculation() {
      const robotCount = this.robots.length;
      if (robotCount === 0 || this.availableHeight === 0) {
        return { tileHeight: this.minTileHeightInPx, columns: 1 };
      }

      const gap = 8;
      const availableHeightForTiles = this.availableHeight;

      // calc best layout for tile amount and panel size
      let bestLayout = { tileHeight: 75, columns: 1 };

      const maxColumns = Math.min(10, Math.ceil(robotCount / 2));

      for (let columns = 1; columns <= maxColumns; columns++) {
        const tilesPerColumn = Math.ceil(robotCount / columns);
        const requiredHeight = tilesPerColumn * this.minTileHeightInPx + tilesPerColumn * gap;

        if (requiredHeight <= availableHeightForTiles) {
          const maxTileHeight = (availableHeightForTiles - tilesPerColumn * gap) / tilesPerColumn;
          bestLayout = {
            tileHeight: Math.max(this.minTileHeightInPx, maxTileHeight),
            columns: columns,
          };
          break;
        }
      }

      return bestLayout;
    },

    tileHeight() {
      return this.layoutCalculation.tileHeight;
    },

    tileWidth() {
      return (this.availableWidth - 12) / this.layoutCalculation.columns;
    },

    numberOfColumns() {
      return this.layoutCalculation.columns;
    },
  },

  methods: {
    calculateAvailableDimensions() {
      this.$nextTick(() => {
        const robotsList = this.$refs.robotsList;
        if (robotsList) {
          this.availableHeight = robotsList.clientHeight;
          this.availableWidth = robotsList.clientWidth;
        }
      });
    },
  },

  mounted() {
    // init mock data
    this.robots = generateRobots(18);

    this.calculateAvailableDimensions();
    this.resizeObserver = new ResizeObserver(() => {
      this.calculateAvailableDimensions();
    });

    if (this.$refs.robotsList) {
      this.resizeObserver.observe(this.$refs.robotsList);
    }
  },

  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.left-panel-container {
  height: 100%;
}

.robots-list {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-content: center;
  align-items: flex-start;
  justify-content: center;
}
</style>
