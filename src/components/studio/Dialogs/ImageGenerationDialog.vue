<template>
  <div class="generate-modal-background">
    <div class="generate-modal">
      <div class="header">
        <h2>Image Export</h2>
      </div>
      <div class="generate-status-area">
        <div class="map-icon">
          <MapIcon :size="24" class="icon" />
        </div>
        <div class="texts">
          <h4>
            Generating image...
          </h4>
          <VLoadingBar />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapIcon from "@/components/icons/MapIcon.vue";
import VLoadingBar from "@/components/base/v-loading-bar.vue";

export default {
  components: {
    MapIcon,
    VLoadingBar,
  },
};
</script>

<style lang="scss" scoped>
.generate-modal-background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  background: var(--popup-background);
  display: flex;
  align-items: center;
  justify-content: center;

  .generate-modal {
    display: flex;
    flex-direction: column;
    width: 500px;
    background: var(--color-secondary);
    border-radius: 6px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid var(--border-color);

      h2 {
        // font-weight: bold;
        font-weight: 500;
      }

      .close-btn {
        display: flex;
        align-items: center;
        border: 0;
        background: 0;
        padding: 5px;
        border-radius: 6px;

        &:hover {
          cursor: pointer;
          background: var(--color-secondary-light);
        }
      }
    }

    .generate-status-area {
      display: flex;
      flex-direction: row;
      flex: 1;
      padding: 15px;

      .map-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-primary-light);
        color: var(--color-primary);
      }

      .texts {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        margin-left: 15px;

        h4 {
        }
      }
    }
  }
}
</style>
