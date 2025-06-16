<template>
    <div class="map-content">
        <h2>Map Container </h2>
    </div>
</template>

<script>
export default {
    name: "MapContent",
    data() {
        return {};
    },
    methods: {},
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.map-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: colors.$darkBlue;
    color: colors.$white;
}
</style>
