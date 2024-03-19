<template>
  <div class="v-checkbox" @click="$emit('update:modelValue', !modelValue)">
    <component
      :is="modelValue ? 'CheckBoxIcon' : 'CheckBoxOutlineIcon'"
      :size="size"
    />
    <span class="checkbox-label" v-if="label">{{ label }}</span>
  </div>
</template>

<script>
import CheckBoxIcon from "@/components/icons/CheckBoxIcon.vue";
import CheckBoxOutlineIcon from "@/components/icons/CheckBoxOutlineIcon.vue";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    size: {
      type: [String, Number],
      default: "18",
    },
  },
  emits: {
      'update:modelValue': {
          type: Boolean
      }
  },
  components: {
    CheckBoxIcon,
    CheckBoxOutlineIcon,
  },
};
</script>

<style lang="scss" scoped>
.v-checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;

  .checkbox-label {
    margin-left: 5px;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
