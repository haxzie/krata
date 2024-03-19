<template>
  <div class="import-modal-background">
    <div class="import-modal">
      <div class="header">
        <h2>Import Files</h2>
        <button class="close-btn" @click="$emit('close')">
          <ClearIcon :size="18" />
        </button>
      </div>
      <div class="import-status-area">
        <div class="file-icon">
          <FileUploadIcon :size="24" class="icon" />
        </div>
        <div class="texts">
          <h4>
            Importing <strong>{{ filename }}</strong
            >...
          </h4>
          <VLoadingBar />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClearIcon from "@/components/icons/ClearIcon.vue";
import FileUploadIcon from "@/components/icons/FileUploadIcon.vue";
import { computed, onMounted } from "vue";
import VLoadingBar from "@/components/base/v-loading-bar.vue";
import { useStoreModule } from "@/composables/useStoreModule.js";

export default {
  components: {
    ClearIcon,
    FileUploadIcon,
    VLoadingBar,
  },
  props: {
    file: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const filename = computed(() => props.file.name);
    const { actions } = useStoreModule("editor");
    onMounted(async () => {
      await actions.loadGeoJSONFile(props.file);
      emit("close");
    });
    return { filename };
  },
};
</script>

<style lang="scss" scoped>
.import-modal-background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  background: var(--popup-background);
  display: flex;
  align-items: center;
  justify-content: center;

  .import-modal {
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

    .import-status-area {
      display: flex;
      flex-direction: row;
      flex: 1;
      padding: 15px;

      .file-icon {
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
