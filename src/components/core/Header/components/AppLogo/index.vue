<template>
  <img :src="AppLogo" alt="ESS Logo" class="app-logo" width="150" height="50" />
</template>

<script>
import AppLogo from "@/assets/images/ESS-logo-white.svg";

export default {
  name: "AppLogo",
  data: () => ({ AppLogo }),
};
</script>

<style scoped lang="scss">
.app-logo {
  display: block;
}
</style>
