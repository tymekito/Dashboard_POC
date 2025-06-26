<template>
  <main class="main-component">
    <AppHeader />
    <router-view v-slot="{ Component }">
      <component :is="Component" :key="$route.path" />
    </router-view>
    <notifications position="bottom right" />
    <SpinLoader />
  </main>
</template>

<script setup>
import AppHeader from "@/components/core/Header/index.vue";
import SpinLoader from "@/components/core/SpinLoader/index.vue";
</script>

<style lang="scss" src="@/assets/styles/default/default.scss" />
