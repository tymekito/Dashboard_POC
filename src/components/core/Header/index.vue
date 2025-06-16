<template>
  <header class="app-header">
    <div class="header-left">
      <img :src="AppLogo" width="150" height="50" />
    </div>
    <div class="header-right">
      {{ currentDateTime }}
    </div>
  </header>
</template>

<script>
import AppLogo from "@/assets/images/ESS-logo-white.svg";

export default {
  name: "Header",
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
@use "@/assets/styles/abstracts/_sizes.scss" as sizes;
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background-color: colors.$darkBlue;
  color: white;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-right {
    font-weight: 500;
    font-size: 1.4rem;
  }
}
</style>
