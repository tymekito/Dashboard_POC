<template>
  <div v-if="areaName" class="area-name">
    {{ areaName }}
  </div>
</template>

<script>
export default {
  name: "AppText",
  props: {
    areaName: { type: String, default: "" },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.area-name {
  font-weight: 600;
  font-size: 1.6rem;
  color: colors.$white;
  text-transform: capitalize;
}
</style>
