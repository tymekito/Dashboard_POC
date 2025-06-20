<template>
  <main class="main-component">
    <AppHeader />
    <router-view v-slot="{ Component }">
      <component :is="Component" :key="$route.path" />
    </router-view>
    <notifications position="bottom right" />
    <Loader />
  </main>
</template>

<script setup>
import AppHeader from "@/components/core/Header/index.vue";
import Loader from "@/components/core/Loader/index.vue";
</script>

<style lang="scss" src="@/assets/styles/default/default.scss" />
