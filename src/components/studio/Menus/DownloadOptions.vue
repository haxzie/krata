<template>
  <div class="options" v-click-away="() => $emit('close')">
    <div
      v-for="option in options"
      :key="option.id"
      class="option-item"
      @click="selectOption(option.id)"
    >
      {{ option.name }}
    </div>
  </div>
</template>

<script>
export default {
  setup(_, { emit }) {
    const options = {
      screenshot: {
        id: "screenshot",
        name: "Export Image",
      },
      geojson: {
        id: "geojson",
        name: "Export as .geojson",
      },
      kml: {
        id: "kml",
        name: "Export as .kml",
      },
    };

    const selectOption = (option) => {
      switch (option) {
        case options.screenshot.id:
          emit("saveScreenshot");
          break;
        case options.geojson.id:
          emit("saveGeoJson");
          break;
        case options.kml.id:
          emit("saveKML");
          break;
      }
      emit("close");
    };

    return { options: Object.values(options), selectOption };
  },
};
</script>

<style lang="scss" scoped>
.options {
  position: absolute;
  z-index: 999;
  width: 200px;
  height: auto;
  background: var(--color-secondary);
  display: flex;
  flex-direction: column;
  top: 52px;
  right: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);

  .option-item {
    padding: 10px;
    color: var(--font-color);

    &:hover {
      cursor: pointer;
      background: var(--color-secondary-light);
    }
  }
}
</style>
