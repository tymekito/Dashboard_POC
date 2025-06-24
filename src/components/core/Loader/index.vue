<template>
  <div v-if="loaderStore.displayLoader" class="loader-overlay">
    <div class="loader-container">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import { useLoaderStore } from "@/stores/common/loader/store.js";

export default {
  name: "SpinLoader",
  setup() {
    const loaderStore = useLoaderStore();

    return {
      loaderStore,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: colors.$blackAlfa50;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-container {
  padding: 3rem;
  border-radius: 0.75rem;
  text-align: center;
}

.spinner {
  border: 0.8rem solid colors.$lightGrey;
  border-top: 0.8rem solid colors.$lightBlue;
  border-radius: 50%;
  width: 15rem;
  height: 15rem;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-text {
  margin: 0;
  color: colors.$grey;
  font-size: 0.875rem;
}
</style>
