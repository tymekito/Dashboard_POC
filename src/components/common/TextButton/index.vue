<template>
  <v-btn
    :disabled="disabled"
    @click="onClickAction()"
    :min-height="minHeight"
    :min-width="minWidth"
    :style="`${backgroundColor} ${outlineColor}`"
    class="baseButton"
  >
    {{ buttonLabel }}
    <slot name="right-icon"></slot>
  </v-btn>
</template>

<script>
import colors from "@/assets/styles/abstracts/_colors.module.scss";

export default {
  name: "TextButton",
  props: {
    label: String,
    disabled: Boolean,
    outlined: Boolean,
    stateMonitor: Boolean,
    stateColor: String,
    stateLabel: String,
    color: String,
    minWidth: [String, Number],
    minHeight: [String, Number],
  },
  data: () => ({
    clicked: false,
  }),
  computed: {
    buttonLabel() {
      if (this.stateMonitor) {
        return `${this.clicked ? this.stateLabel : this.label}`;
      }
      return `${this.label}`;
    },
    backgroundColor() {
      if (this.stateMonitor) {
        return `background-color: ${this.clicked ? this.stateColor : this.color};`;
      }
      return `background-color: ${!this.color ? colors.lightBlue : this.color};`;
    },
    outlineColor() {
      return this.outlined ? "border: 0.2em solid;" : "";
    },
  },
  methods: {
    onClickAction() {
      if (this.stateMonitor) {
        this.clicked = !this.clicked;
      }
      this.$emit("onClickAction");
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.baseButton:disabled {
  background-color: colors.$whiteAlfa25 !important;
}
.baseButton {
  color: colors.$white !important;
  font-size: 1rem;
}
.baseButton {
  ::v-deep(.v-btn__content) {
    white-space: pre-wrap;
  }
}
</style>
