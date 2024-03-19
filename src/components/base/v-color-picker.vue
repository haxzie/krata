<template>
  <form :class="['color-picker', { isHidden: hide }]">
    <!-- <div class="current-color"></div> -->
    <color-picker
      v-model:pureColor="pureColor"
      class="cp-custom"
      :format="'rgb'"
      :shape="'circle'"
      :pickerType="'chrome'"
      :useType="'pure'"
    />
    <input
      ref="colorInput"
      type="text"
      name="colorInput"
      :value="hexColor"
      class="color-input"
      @blur="updateColors"
    />
    <div class="divider"></div>
    <input
      ref="alphaInput"
      type="text"
      name="alphaInput"
      :value="aphaValue"
      class="alpha-input"
      @blur="updateColors"
    />
    <div class="visibility" @click="toggleHideState">
      <component
        :is="hide ? 'VisibilityOffIcon' : 'VisibilityIcon'"
        :size="18"
      />
    </div>
  </form>
</template>

<script>
import VisibilityIcon from "@/components/icons/VisibilityIcon.vue";
import VisibilityOffIcon from "@/components/icons/VisibilityOffIcon.vue";
import { ColorPicker } from "vue3-colorpicker";
import "@/styles/overrides/v3-color-picker.scss";
import { ref, computed } from "vue";
import chroma from "chroma-js";

export default {
  components: {
    VisibilityIcon,
    VisibilityOffIcon,
    ColorPicker,
  },
  props: {
    color: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    hide: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const isHidden = ref(false);
    const pureColor = computed({
      get: () => {
        const color = [...props.color];
        color[3] = +Number(color[3] / 255).toFixed(2);
        const rgba = `rgba(${color.join(", ")})`;
        return rgba;
      },
      set: (color) => {
        const colorArray = chroma(color).rgba();
        colorArray[3] = Math.min(Math.ceil(colorArray[3] * 255), 255);
        emit("onChangeColor", colorArray);
      },
    });

    const hexColor = computed(() => {
      const color = [...props.color];
      return String(chroma(color.slice(0, -1)).hex())
        .slice(1)
        .toUpperCase();
    });

    const aphaValue = computed(() => {
      const a = [...props.color][3];
      return `${Number(((a / 255) * 100).toFixed(0))}%`;
    });

    const colorInput = ref(null);
    const alphaInput = ref(null);

    const updateColors = () => {
      const color = colorInput.value?.value;
      const alpha = alphaInput.value?.value;

      try {
        // clean up the color value
        let colorValue = color[0] === "#" ? color.slice(1) : color;
        colorValue = color.length === 6 ? color : hexColor.value;
        const colorArray = chroma("#" + colorValue).rgba();

        // clean up alpha value
        const alphaValue =
          alpha[alpha.length] === "%" ? alpha.slice(0, -1) : alpha;
        let value = parseFloat(alphaValue);
        value = value <= 100 && value >= 0 ? value : 100;
        colorArray[3] = Number(((value / 100) * 255).toFixed(0));
        emit("onChangeColor", colorArray);
      } catch (error) {
        // fallback to default
        const colorArray = chroma("#" + hexColor.value).rgba();
        colorArray[3] = colorArray[3] * 255;
        emit("onChangeColor", colorArray);
        console.error(error);
      }
    };

    const toggleHideState = () => {
      emit("onChangeHide", !props.hide);
    };

    return {
      isHidden,
      pureColor,
      hexColor,
      aphaValue,
      updateColors,
      colorInput,
      alphaInput,
      toggleHideState,
    };
  },
};
</script>

<style lang="scss" scoped>
.color-picker {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 2px solid transparent;
  padding: 5px 0;

  &:hover {
    // border: 2px solid var(--color-primary);
  }

  .current-color {
    width: 24px;
    height: 24px;
    background: var(--color-primary);
    border-radius: 2px;

    &:hover {
      cursor: pointer;
    }
  }

  .divider {
    background: var(--color-secondary-light);
    width: 1px;
    height: 24px;
  }

  .color-input,
  .alpha-input {
    height: 20px;
    outline: none;
    border: 0;
    padding: 0 10px;
    size: 2;
    min-width: 0;
    background: var(--color-secondary);
    border: 2px solid transparent;
    flex: 1;
    margin-left: 2px;
    text-transform: uppercase;

    &:focus {
      border: 2px solid var(--color-primary);
    }
  }

  .alpha-input {
    margin-right: 10px;
  }

  .visibility {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;

    &:hover {
      cursor: pointer;
    }
  }

  &.isHidden {
    opacity: 0.5;

    .cp-custom,
    input {
      pointer-events: none;
    }
  }
}
</style>
