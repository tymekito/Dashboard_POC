<template>
  <div
    class="collapse-trigger-area"
    :class="`${side}-trigger`"
    @mouseenter="showButton = true"
    @mouseleave="showButton = false"
  >
    <button v-show="showButton" class="collapse-button" @click="$emit('toggle')">
      {{ buttonIcon }}
    </button>
  </div>
</template>

<script>
export default {
  name: "PanelCollapseButton",
  props: {
    isCollapsed: { type: Boolean, required: true },
    side: { type: String, required: true, validator: (value) => ["left", "right"].includes(value) },
  },
  emits: ["toggle"],
  data: () => ({ showButton: false }),
  computed: {
    buttonIcon() {
      if (this.side === "left") return this.isCollapsed ? "▶" : "◀";
      return this.isCollapsed ? "◀" : "▶";
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.collapse-trigger-area {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2rem;
  z-index: 20;

  &.left-trigger {
    right: -10px;
  }
  &.right-trigger {
    left: -10px;
  }
}

.collapse-button {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  background: colors.$lightBlue;
  border: 2px solid colors.$white;
  color: colors.$white;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 154, 190, 0.6);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
}

.left-trigger .collapse-button {
  right: -0.6rem;
}
.right-trigger .collapse-button {
  left: -0.3rem;
}
</style>
