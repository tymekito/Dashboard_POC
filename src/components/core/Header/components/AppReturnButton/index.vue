<template>
  <button class="back-button" @click="handleBackClick" aria-label="Wróć do poprzedniej aplikacji">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  </button>
</template>

<script>
import Config from "@/app.config.js";

export default {
  name: "BackButton",
  methods: {
    handleBackClick() {
      if (Config.appV1Url()) {
        window.open(Config.appV1Url(), "_self");
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: transparent;
  border: 0.125rem solid colors.$lightBlue;
  border-radius: 0.375rem;
  color: colors.$white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: colors.$lightBlue;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
