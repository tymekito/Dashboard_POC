<template>
  <header class="app-header">
    <div class="header-left">
      <img :src="AppLogo" width="150" height="50" />
    </div>
    <div class="header-middle">
      <div v-if="areaStore.areaName" class="area-name">
        {{ areaStore.areaName }}
      </div>
    </div>
    <div class="header-right">
      {{ currentDateTime }}
    </div>
  </header>
</template>

<script>
import AppLogo from "@/assets/images/ESS-logo-white.svg";
import { useAreaStore } from "@/stores/local/area.js";

export default {
  name: "Header",
  setup() {
    const areaStore = useAreaStore();
    return { areaStore };
  },
  data() {
    return {
      currentDateTime: "",
      interval: null,
      AppLogo,
    };
  },
  mounted() {
    this.updateDateTime();
    this.interval = setInterval(this.updateDateTime, 1000);
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentDateTime = now.toLocaleString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;
@use "@/assets/styles/abstracts/_sizes.scss" as sizes;

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background-color: colors.$darkBlue;
  color: white;
  height: sizes.$header;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .header-middle {
    .area-name {
      margin-left: auto;
      margin-right: auto;
      font-weight: 600;
      font-size: 1.6rem;
      color: colors.$white;
      text-transform: capitalize;
    }
  }

  .header-right {
    font-weight: 500;
    font-size: 1.4rem;
  }
}
</style>
