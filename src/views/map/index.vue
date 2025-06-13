<template>
    <div class="component">
        <h1>Component Template</h1>
        <p>This is a placeholder for your component.</p>
    </div>
</template>

<script>
export default {
    name: "MapContainer",
    components: {},
    data: () => ({}),
    computed: {},
    methods: {},
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_sizes.scss" as sizes;
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.component {
    background-color: colors.$darkBlue;
    width: 100%;
    height: 100%;
    color: colors.$white;
}
</style>
