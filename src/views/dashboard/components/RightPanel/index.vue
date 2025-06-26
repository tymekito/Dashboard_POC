<template>
  <div class="right-panel-container">
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
import { useRobotStore } from "@/stores/common/dashboard/robots/store.js";
import RobotTile from "./components/RobotTile.vue";
import { LAYOUT_CONFIG } from "./constants.js";

export default {
  name: "RightPanel",
  components: {
    RobotTile,
  },

  setup() {
    const robotStore = useRobotStore();
    return { robotStore };
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
    await this.robotStore.getAllRobots();
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
      const columnGap = columns > 1 ? LAYOUT_CONFIG.COLUMN_GAP * (columns - 1) : 0;
      return (this.dimensions.width - columnGap) / columns;
    },

    layoutData() {
      if (this.dimensions.width === 0 || this.dimensions.height === 0) {
        return { columns: 1, rows: 1, tileHeight: this.minTileHeight };
      }

      const availableWidth = this.dimensions.width;
      const availableHeight = this.dimensions.height;
      const totalRobots = this.robotStore.robots.length;

      if (totalRobots === 0) {
        return { columns: 1, rows: 1, tileHeight: this.minTileHeight };
      }

      const maxColumns = Math.max(1, Math.floor(availableWidth / LAYOUT_CONFIG.MIN_TILE_WIDTH));
      let bestLayout = { columns: 1, rows: totalRobots, tileHeight: this.minTileHeight };

      for (let columns = 1; columns <= maxColumns; columns++) {
        const rows = Math.ceil(totalRobots / columns);
        const columnGap = columns > 1 ? LAYOUT_CONFIG.COLUMN_GAP * (columns - 1) : 0;
        const rowGap = rows > 1 ? LAYOUT_CONFIG.ROW_GAP * (rows - 1) : 0;

        const tileWidth = (availableWidth - columnGap) / columns;
        const tileHeight = (availableHeight - rowGap) / rows;

        if (
          tileWidth >= LAYOUT_CONFIG.MIN_TILE_WIDTH &&
          tileHeight >= this.minTileHeight &&
          tileHeight <= this.maxTileHeight
        ) {
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

.right-panel-container {
  height: 100%;
}

.robots-list {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap-reverse;
  flex-direction: column;
  gap: $tileGap;
  align-items: flex-start;
}
</style>
