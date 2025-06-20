<template>
  <div class="date-time">
    {{ currentDateTime }}
  </div>
</template>

<script>
export default {
  name: "AppDateTime",
  data: () => ({
    currentDateTime: "",
    interval: null,
  }),

  mounted() {
    this.updateDateTime();
    this.interval = setInterval(this.updateDateTime, 1000);
  },

  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },

  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentDateTime = now.toLocaleString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.date-time {
  font-weight: 500;
  font-size: 1.4rem;
}
</style>
