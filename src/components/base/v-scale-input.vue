<template>
  <div class="width-picker">
    <div class="icon">
      <component :is="icon" size="18" />
    </div>
    <v-dropdown
      :value="scale"
      :options="scaleOptions"
      @select="updateScale"
      width="100px"
    />
    <input
      ref="widthInput"
      type="text"
      name="widthInput"
      :value="value"
      class="width-input"
      @blur="updateLineWidth"
      placeholder="0"
    />
    <div class="slider">
      <slider
        v-model="width"
        color="var(--color-primary)"
        track-color="var(--color-secondary-light)"
        :tooltip="false"
        :max="1000"
      />
    </div>
  </div>
</template>

<script>
import WidthIcon from "@/components/icons/WidthIcon.vue";
import RadiusIcon from "@/components/icons/RadiusIcon.vue";
import VDropdown from "@/components/base/v-dropdown.vue";
import { DISTANCE_SCALE } from "@/utils/constants.js";
import slider from "vue3-slider";
import { computed, ref } from "vue";
export default {
  components: {
    WidthIcon,
    slider,
    VDropdown,
    RadiusIcon,
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    scale: {
      type: String,
    },
    icon: {
      type: String,
      default: "WidthIcon",
    },
  },
  setup(props, { emit }) {
    const width = computed({
      get() {
        return parseInt(props.value);
      },
      set(value) {
        emit("onWidthChange", parseInt(value));
      },
    });

    const widthInput = ref(null);
    const updateLineWidth = () => {
      const width = widthInput.value?.value;
      try {
        let widthValue = Number(width);
        widthValue = widthValue > 1000 ? 100 : widthValue < 0 ? 0 : widthValue;
        emit("onWidthChange", widthValue);
      } catch (error) {
        console.error(error);
        emit("onWidthChange", props.width);
      }
    };

    const updateScale = (value) => {
      emit("onScaleChange", value);
    };

    return {
      width,
      widthInput,
      updateLineWidth,
      scaleOptions: DISTANCE_SCALE,
      updateScale,
    };
  },
};
</script>

<style lang="scss" scoped>
.width-picker {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 2px solid transparent;
  padding: 5px 0;

  .icon {
    display: flex;
    width: 24px;
    height: 24px;
    // background: var(--color-secondary-light);
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    margin-right: 0;
  }

  input {
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

  .slider {
    flex: 2;
    margin-left: 10px;
    z-index: 99 !important;
  }
}
</style>
