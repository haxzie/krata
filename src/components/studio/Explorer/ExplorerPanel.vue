<template>
  <div class="explorer-panel">
    <div class="header">
      <h4 class="title">
        <layers-icon class="icon" :size="18" />
        <span>Features</span>
      </h4>
      <button class="import-button" @click="showImportModal">
        <add-icon class="icon" :size="18" />
        Import
      </button>
    </div>
    <feature-list />
  </div>
</template>

<script>
import { useStoreModule } from "@/composables/useStoreModule.js";
import LayersIcon from "@/components/icons/LayersIcon.vue";
import AddIcon from "@/components/icons/AddIcon.vue";
import { computed, defineComponent } from "vue";
import FeatureList from "./FeatureList.vue";

export default defineComponent({
  components: {
    LayersIcon,
    AddIcon,
    FeatureList,
  },
  setup() {
    const UIStore = useStoreModule("UI");
    const isShapesEditable = computed(
      () => UIStore.getters.getAccessFlags.isShapesEditable
    );

    const showImportModal = () => {
      UIStore.actions.setShowImportModal(true);
    }

    return {
      isShapesEditable,
      showImportModal
    };
  },
});
</script>

<style lang="scss" scoped>
.explorer-panel {
  display: flex;
  flex-direction: column;
  background: var(--color-secondary);
  overflow: hidden;
  border-right: 1px solid var(--color-secondary-light);
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-secondary-light);
    background: var(--color-secondary);
    padding: 0 5px;

    .title {
      padding: 10px;
      border-bottom: 2px solid transparent;
      display: flex;
      align-items: center;
      color: var(--font-color);

      span {
        margin-left: 10px;
        color: currentColor;
        font-weight: bold;
      }
    }

    .import-button {
      display: flex;
      align-items: center;
      border: 0;
      height: auto;
      background: transparent;
      padding: 7px 10px !important;
      font-weight: 500;
      border-radius: 3px;
      color: var(--font-color-light);

      // opacity: 0.5;

      .icon {
        margin-right: 5px;
      }

      &:hover {
        color: var(--font-color);
        cursor: pointer;
        opacity: 1;
        // background: var(--color-secondary-light);
      }
    }
  }
}
</style>
