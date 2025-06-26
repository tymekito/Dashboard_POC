<template>
  <div class="right-panel-container">
    <div ref="missionsList" class="missions-list">
      <MissionTile v-for="mission in missionStore.missions" :key="mission.id" :mission="mission" :height="tileHeight" />
    </div>
  </div>
</template>

<script>
import { useMissionStore } from "@/stores/common/dashboard/missions/store.js";
import MissionTile from "./components/MissionTile/index.vue";
import { LAYOUT_CONFIG } from "./constants.js";

export default {
  name: "RightPanel",
  components: {
    MissionTile,
  },
  setup() {
    const missionStore = useMissionStore();
    return { missionStore };
  },
  data() {
    return {
      dimensions: {
        height: 0,
        width: 0,
      },
      resizeObserver: null,
      minTileHeight: LAYOUT_CONFIG.MIN_TILE_HEIGHT,
    };
  },

  computed: {
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

  async mounted() {
    await this.missionStore.getAllMissions(15);
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
