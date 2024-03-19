<template>
  <div class="color-picker">
    <!-- <div class="current-color"></div> -->
    <color-picker
      v-model:pureColor="pureColor"
      class="cp-custom"
      :format="'rgb'"
      :shape="'circle'"
      :pickerType="'chrome'"
      :useType="'pure'"
    />
  </div>
</template>

<script>
import { ColorPicker } from "vue3-colorpicker";
import "@/styles/overrides/v3-color-picker.scss";
import { ref, computed } from "vue";
import chroma from "chroma-js";

export default {
  components: {
    ColorPicker,
  },
  props: {
    color: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
  },
  setup(props, { emit }) {
    const pureColor = computed({
      get: () => {
        const color = [...props.color];
        color[3] = Number((color[3] / 255).toFixed(2));
        const rgb = `rgba(${color.join(", ")})`;
        return rgb;
      },
      set: (color) => {
        const colorArray = chroma(color).rgba();
        colorArray[3] = colorArray[3] * 255;
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

    return {
      pureColor,
      hexColor,
      aphaValue,
      updateColors,
      colorInput,
      alphaInput,
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
}
</style>
