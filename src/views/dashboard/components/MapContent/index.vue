<template>
  <div class="component">
    <h1>MapContent</h1>
  </div>
</template>

<script>
import { useAreaDataStore } from "@/stores/common/dashboard/areaData/store.js";

export default {
  name: "MapContent",
  components: {},
  setup() {
    const areaDataStore = useAreaDataStore();
    return {
      areaDataStore,
    };
  },
  data: () => ({}),
  computed: {},
  methods: {},
  async mounted() {
    await this.areaDataStore.getAreaMapPoints(this.areaDataStore.areaName);
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.component {
  background-color: colors.$darkBlue;
  color: colors.$white;
}
</style>
