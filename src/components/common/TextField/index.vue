<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :variant="variant"
    :clearable="clearable"
    :color="color"
    :base-color="baseColor"
    :class="fieldClass"
    @update:model-value="handleInput"
    @input="handleInputEvent"
  />
</template>

<script>
export default {
  name: "TextField",

  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "filled",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "primary",
    },
    baseColor: {
      type: String,
      default: "",
    },
    fieldClass: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue", "input"],

  methods: {
    handleInput(value) {
      this.$emit("update:modelValue", value);
    },
    handleInputEvent(event) {
      this.$emit("input", event);
    },
  },
};
</script>
