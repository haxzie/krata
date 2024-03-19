<template>
  <button
    :class="[
      'v-button',
      { small, rounded, danger },
      theme,
      { disabled: disabled || isLoading },
    ]"
    :type="type"
    @click="$emit('click')"
  >
    <div :class="['button-contents', { hidden: isLoading }]">
      <slot name="iconLeft"></slot>
      <span
        >{{ text }}
        <slot name="iconRight"></slot>
      </span>
    </div>
    <v-loading-dots
      class="floating-dots"
      :width="'40px'"
      :height="'20px'"
      v-if="isLoading"
    />
  </button>
</template>

<script>
import VLoadingDots from "@/components/base/v-loading-dots.vue";

export default {
  props: {
    type: {
      type: String,
      default: "submit",
    },
    text: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "primary",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    iconLeft: {
      type: String,
    },
    iconRight: {
      type: String,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    danger: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VLoadingDots,
  },
};
</script>

<style lang="scss" scoped>
.v-button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 20px;
  background: var(--color-primary);
  border-radius: 6px;
  border: 0px solid transparent;
  font-weight: bold;
  opacity: 0.8;
  font-family: var(--fontface-title);
  position: relative;
  z-index: 1;
  color: var(--color-secondary);
  font-size: var(--font-size-s);
  // margin: 0 0 5px 0;

  &.small {
    padding: 10px 15px;
  }

  .button-contents {
    display: flex;
    align-items: center;

    span {
      color: var(--color-secondary);
      font-weight: 500;
    }

    &.hidden {
      opacity: 0;
    }
  }

  .floating-dots {
    position: absolute;
    color: var(--color-secondary);
  }

  // &:before {
  //   content: '';
  //   width: 100%;
  //   height: 100%;
  //   position: absolute;
  //   border: 2px solid var(--font-color);
  //   background: var(--color-secondary);
  //   border-radius: 10px;
  //   z-index: 0;
  //   top: -2px;
  //   left: -2px;
  //   border-radius: 10px;
  //   z-index: -1;
  // }

  // &:after {
  //   content: '';
  //   width: 100%;
  //   height: 100%;
  //   position: absolute;
  //   left: 7px;
  //   top: 7px;
  //   background: var(--color-primary);
  //   z-index: -2;
  //   border-radius: 10px;
  // }

  &.rounded {
    border-radius: 100px;
    padding: 15px 20px;
  }

  &.accent {
    background: var(--color-accent);
    // &:after {
    // }
  }

  &.accent-2 {
    background: var(--color-accent-2);
    // &:after {
    // }
  }

  &.light {
    background: var(--color-secondary-light);
    color: var(--font-color);
    opacity: 0.8;

    span {
      color: var(--font-color);
    }
  }

  &.white {
    background: #fff;
    color: var(--color-secondary);
  }

  &.gradient {
    opacity: 1;
    background: var(--color-primary-gradient);
  }

  &.danger {
    opacity: 0.8;
    background: var(--color-error);
  }

  &:hover {
    cursor: pointer;
    opacity: 1;
    // background: var(--font-color);
    // color: var(--color-secondary);
  }

  &:active {
    opacity: 0.7;

    // .button-contents {
    //   padding-top: 2px;
    //   padding-left: 2px;
    // }

    // &:before {
    //   top: 1px;
    //   left: 1px;
    // }
  }

  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
    // &:after {
    //   background: var(--font-color);
    //   opacity: 0.6;
    // }
  }
}
</style>
