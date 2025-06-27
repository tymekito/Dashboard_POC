<template>
  <div class="bottom-bar">
    <div class="missions-container" ref="container">
      <MissionTile
        v-for="mission in visibleMissions"
        :key="mission.id"
        :mission="mission"
        :width="LAYOUT_CONFIG.TILE_WIDTH"
        :height="LAYOUT_CONFIG.TILE_HEIGHT"
      />
      <div v-if="hasMoreMissions" class="more-missions">+{{ remainingCount }} więcej</div>
    </div>
  </div>
</template>

<script>
import { useMissionStore } from "@/stores/common/dashboard/missions/store.js";
import MissionTile from "./components/MissionTile/index.vue";
import { LAYOUT_CONFIG } from "./constants.js";

export default {
  name: "BottomBar",
  components: {
    MissionTile,
  },
  setup() {
    const missionStore = useMissionStore();
    return { missionStore };
  },

  data() {
    return {
      containerWidth: 0,
      resizeObserver: null,
      LAYOUT_CONFIG,
    };
  },

  computed: {
    sortedMissions() {
      return [...this.missionStore.missions].sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
    },

    maxVisibleTiles() {
      if (this.containerWidth <= 0) return 1;
      const moreTextWidth = LAYOUT_CONFIG.TILE_WIDTH / 2;

      const availableWidth = this.containerWidth - moreTextWidth;
      const tilesCount = Math.floor(availableWidth / (LAYOUT_CONFIG.TILE_WIDTH + LAYOUT_CONFIG.TILE_GAP));

      return Math.max(1, tilesCount);
    },

    visibleMissions() {
      if (this.sortedMissions.length <= this.maxVisibleTiles) {
        return this.sortedMissions;
      }
      return this.sortedMissions.slice(0, this.maxVisibleTiles);
    },

    hasMoreMissions() {
      return this.sortedMissions.length > this.maxVisibleTiles && this.containerWidth > 0;
    },

    remainingCount() {
      return Math.max(0, this.sortedMissions.length - this.maxVisibleTiles);
    },
  },

  methods: {
    updateContainerWidth() {
      this.$nextTick(() => {
        if (this.$refs.container) {
          const rect = this.$refs.container.getBoundingClientRect();
          this.containerWidth = rect.width;
        }
      });
    },

    initializeResizeObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateContainerWidth();
      });

      if (this.$refs.container) {
        this.resizeObserver.observe(this.$refs.container);
      }
    },
  },

  async mounted() {
    await this.missionStore.getAllMissions();
    this.updateContainerWidth();
    this.initializeResizeObserver();
  },

  beforeUnmount() {
    this.resizeObserver?.disconnect();
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.bottom-bar {
  height: 150px;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, colors.$whiteAlfa05 0%, colors.$whiteAlfa04 100%);
  border-top: 1px solid colors.$whiteAlfa25;
  z-index: 100;
}

.missions-container {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1rem;
}

.more-missions {
  color: colors.$white;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0.8;
  flex-shrink: 0;
  padding-left: 5px;
}
</style>
