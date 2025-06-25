<template>
  <div class="left-panel-container">
    <div ref="robotsList" class="robots-list">
      <RobotTile
        v-for="robot in robotStore.robots"
        :key="robot.id"
        :robot="robot"
        :width="tileWidth"
        :height="tileHeight"
      />
    </div>
  </div>
</template>

<script>
import RobotTile from "./components/RobotTile.vue";
import { LAYOUT_CONFIG } from "./constants.js";

export default {
  name: "LeftPanel",
  components: {
    RobotTile,
  },
  data() {
    return {
      dimensions: {
        height: 0,
        width: 0,
      },
      resizeObserver: null,
      minTileHeight: LAYOUT_CONFIG.MIN_TILE_HEIGHT,
      maxTileHeight: LAYOUT_CONFIG.MAX_TILE_HEIGHT,
    };
  },

  async mounted() {
    this.updateDimensions();
    this.setupResizeObserver();
  },

  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },

  computed: {
    tileHeight() {
      return this.layoutData.tileHeight;
    },

    tileWidth() {
      const { columns } = this.layoutData;
      const columnGap = columns > 1 ? LAYOUT_CONFIG.TILE_GAP * (columns - 1) : 0;
      return (this.dimensions.width - columnGap) / columns;
    },

    layoutData() {
      if (this.dimensions.width === 0 || this.dimensions.height === 0) {
        return { columns: 1, rows: 1, tileHeight: this.minTileHeight };
      }

      const availableHeight = this.dimensions.height;
      const totalRobots = this.robotStore.robots.length;

      if (totalRobots === 0) {
        return { columns: 1, rows: 1, tileHeight: this.minTileHeight };
      }

      // Calculate optimal columns based on width
      let bestLayout = { columns: 1, rows: totalRobots, tileHeight: this.minTileHeight };

      for (let columns = 1; columns <= LAYOUT_CONFIG.MAX_COLUMNS; columns++) {
        const rows = Math.ceil(totalRobots / columns);
        const rowGap = rows > 1 ? LAYOUT_CONFIG.TILE_GAP * (rows - 1) : 0;

        const tileHeight = (availableHeight - rowGap) / rows;

        if (tileHeight >= this.minTileHeight && tileHeight <= this.maxTileHeight) {
          if (tileHeight > bestLayout.tileHeight) {
            bestLayout = { columns, rows, tileHeight };
          }
        }
      }

      return bestLayout;
    },
  },

  methods: {
    updateDimensions() {
      if (this.$refs.robotsList) {
        const rect = this.$refs.robotsList.getBoundingClientRect();
        this.dimensions.width = rect.width;
        this.dimensions.height = rect.height;
      }
    },

    setupResizeObserver() {
      if (typeof ResizeObserver !== "undefined" && this.$refs.robotsList) {
        this.resizeObserver = new ResizeObserver(() => {
          this.updateDimensions();
        });
        this.resizeObserver.observe(this.$refs.robotsList);
      }
    },
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
