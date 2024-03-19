<template>
  <div class="v-input-wrapper">
    <textarea
      :class="['v-input', { error: !matchesPattern }]"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @click="$emit('click')"
      @blur="$emit('blur')"
    />
    <span v-if="!matchesPattern" class="hint">{{ hint }}</span>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    type: {
      default: "text",
      type: String,
    },
    placeholder: {
      default: "",
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    name: {
      default: "",
      type: String,
    },
    modelValue: [String, Number],
  },
  setup(props) {
    const matchesPattern = computed(() => {
      if (!(props.pattern && props.pattern.length > 0) || !props.value)
        return true;
      const regex = new RegExp(props.pattern);
      return regex.test(props.value);
    });
    return { matchesPattern };
  },
};
</script>

<style lang="scss" scoped>
.v-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 5px 0;

  .hint {
    font-size: 0.8rem;
    color: var(--color-error);
  }
}
.v-input {
  background-color: transparent;
  border: 1px solid var(--color-input-border);
  background: transparent;
  color: var(--font-color);
  padding: 10px 15px;
  border-radius: 6px;
  filter: none;
  outline: none !important;
  transition: 0.3s border ease-in-out;
  min-height: 80px;
  resize: none;

  &:focus {
    border-color: var(--color-accent);
  }

  &:invalid {
    border-color: var(--color-error);
  }
}
</style>
