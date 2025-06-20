<template>
  <div class="resize-handle" :class="`${side}-handle`" @mousedown="$emit('start-resize', $event)" />
</template>

<script>
export default {
  name: "ResizeHandle",
  props: {
    side: { type: String, required: true, validator: (value) => ["left", "right"].includes(value) },
  },
  emits: ["start-resize"],
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.resize-handle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 8rem;
  cursor: col-resize;
  background: colors.$lightBlue;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  opacity: 0.7;
  z-index: 999;

  &:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0.125rem 0.5rem rgba(0, 154, 190, 0.5);
  }

  &.right-handle {
    right: -6px;
  }
  &.left-handle {
    left: -5px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.25rem;
    height: 1.875rem;
    background: colors.$white;
    border-radius: 0.125rem;
    opacity: 0.8;
  }
}
</style>
