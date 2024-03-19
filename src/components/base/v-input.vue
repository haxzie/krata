<template>
  <div class="v-input-wrapper">
    <input
      ref="inputRef"
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
import { computed, onMounted, ref } from "vue";

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
    autofocus: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    const inputRef = ref();
    const matchesPattern = computed(() => {
      if (!(props.pattern && props.pattern.length > 0) || !props.value)
        return true;
      const regex = new RegExp(props.pattern);
      return regex.test(props.value);
    });

    onMounted(() => {
      if (props.autofocus && inputRef.value) {
        inputRef.value.focus();
      }
    });
    return { matchesPattern, inputRef };
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
  border: 1px solid var(--color-input-border);
  background: transparent;
  color: var(--font-color);
  padding: 10px 15px;
  border-radius: 6px;
  filter: none;
  outline: none !important;
  transition: 0.3s border ease-in-out;
  size: 1;
  flex: 1;
  height: 24px;
  min-width: 0;
  max-width: 100%;

  &:focus {
    border-color: var(--color-accent);
  }

  &:invalid {
    border-color: var(--color-error);
  }
}
</style>
