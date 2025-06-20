<template>
  <div class="component">
    <h1>LeftPanel</h1>
  </div>
</template>

<script>
export default {
  name: "LeftPanel",
  components: {},
  data: () => ({}),
  computed: {},
  methods: {},
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.component {
  background-color: colors.$darkBlue;
}
</style>
