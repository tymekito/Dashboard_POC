<template>
  <main class="main-component">
    <AppHeader />
    <DashboardMap />
    <notifications position="bottom right" />
    <Loader />
  </main>
</template>

<script setup>
import AppHeader from "@/components/core/Header/index.vue";
import Loader from "@/components/core/Loader/index.vue";
import DashboardMap from "@/views/dashboard/index.vue";
</script>

<style lang="scss" src="@/assets/styles/default/default.scss" />
