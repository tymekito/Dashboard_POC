<template>
  <header class="app-header">
    <div class="header-left">
      <AppReturnButton />
      <AppLogo />
    </div>
    <div class="header-middle">
      <AppText :area-name="areaDataStore.areaName" />
    </div>
    <div class="header-right">
      <AppDateTime />
    </div>
  </header>
</template>

<script>
import { useAreaDataStore } from "@/stores/common/areaData/store.js";
import AppDateTime from "./components/AppDateTime/index.vue";
import AppLogo from "./components/AppLogo/index.vue";
import AppReturnButton from "./components/AppReturnButton/index.vue";
import AppText from "./components/AppText/index.vue";

export default {
  name: "AppHeader",
  components: { AppLogo, AppText, AppDateTime, AppReturnButton },

  setup() {
    return {
      areaDataStore: useAreaDataStore(),
    };
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
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header-middle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}
</style>
