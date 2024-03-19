<template>
  <div class="map-controls">
    <div class="control-wrapper">
      <div class="icon-button" role="button" @click="$emit('onClickSearch')">
        <SearchIcon class="icon" size="20" />
      </div>
    </div>
    <div class="control-wrapper">
      <div class="icon-button" role="button" @click="$emit('onClickZoomIn')">
        <AddIcon class="icon" size="20" />
      </div>
      <div class="icon-button" role="button" @click="$emit('onClickZoomOut')">
        <RemoveIcon class="icon" size="20" />
      </div>
    </div>
    <div class="control-wrapper">
      <div class="icon-button" role="button" @click="$emit('onClickFitScreen')">
        <FitScreenIcon class="icon" size="20" />
      </div>
    </div>
  </div>
</template>

<script>
import SearchIcon from "@/components/icons/SearchIcon.vue";
import AddIcon from "@/components/icons/AddIcon.vue";
import RemoveIcon from "@/components/icons/RemoveIcon.vue";
import FitScreenIcon from "@/components/icons/FitScreenIcon.vue";

export default {
  components: {
    SearchIcon,
    AddIcon,
    RemoveIcon,
    FitScreenIcon
  },
};
</script>

<style lang="scss" scoped>
.map-controls {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 99;

  .control-wrapper {
    display: flex;
    flex-direction: column;
    background: var(--color-secondary);
    border-radius: 6px;
    box-shadow: var(--smooth-shadow);
    padding: 2px;
    margin-bottom: 10px;

    .icon-button {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background: var(--color-secondary-light);
        cursor: pointer;
      }
    }
  }
}
</style>
