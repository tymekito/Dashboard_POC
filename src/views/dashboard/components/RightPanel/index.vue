<template>
  <div class="right-panel-container">
    <div ref="missionsList" class="missions-list">
      <MissionTile v-for="mission in displayedMissions" :key="mission.id" :mission="mission" :height="tileHeight" />
    </div>
  </div>
</template>

<script>
import MissionTile from "./components/MissionTile.vue";
import { LAYOUT_CONFIG } from "./constants.js";
import { generateMissions } from "./mockData.js";

export default {
  name: "RightPanel",
  components: {
    MissionTile,
  },

  data() {
    return {
      missions: [],
      dimensions: {
        height: 0,
        width: 0,
      },
      resizeObserver: null,
      minTileHeight: LAYOUT_CONFIG.MIN_TILE_HEIGHT,
    };
  },

  computed: {
    displayedMissions() {
      return this.missions.slice(0, LAYOUT_CONFIG.MAX_ITEMS);
    },

    tileHeight() {
      if (!this.dimensions.height) {
        return LAYOUT_CONFIG.MAX_TILE_HEIGHT;
      }

      const calculatedHeight = this.dimensions.height / LAYOUT_CONFIG.DYNAMIC_HEIGHT_DIVIDER - LAYOUT_CONFIG.TILE_GAP;
      return Math.max(this.minTileHeight, Math.min(calculatedHeight, LAYOUT_CONFIG.MAX_TILE_HEIGHT));
    },
  },

  methods: {
    updateDimensions() {
      this.$nextTick(() => {
        const container = this.$refs.missionsList;
        if (!container) return;

        this.dimensions = {
          height: container.clientHeight,
          width: container.clientWidth,
        };
      });
    },

    initializeResizeObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateDimensions();
      });

      if (this.$refs.missionsList) {
        this.resizeObserver.observe(this.$refs.missionsList);
      }
    },
  },

  mounted() {
    this.missions = generateMissions(15); // Generujemy więcej niż MAX_ITEMS
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

.right-panel-container {
  height: 100%;
}

.missions-list {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: $tileGap;
  padding-right: 0.5rem;
}
</style>
