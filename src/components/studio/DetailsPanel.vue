<template>
  <div class="details-panel">
    <component :is="optionsComponent" :feature="selectedItems[0]" />
  </div>
</template>

<script>
import BaseMapOptions from "@/components/studio/ItemOptions/BaseMapOptions.vue";
import FeatureOptions from "@/components/studio/ItemOptions/FeatureOptions.vue";
import MultiFeatureOptions from "@/components/studio/ItemOptions/MultiFeatureOptions.vue";

import { useStoreModule } from "@/composables/useStoreModule";
import { computed } from "vue";
import { FEATURE_TYPES } from "@/models/Feature.model";

export default {
  components: {
    BaseMapOptions,
    FeatureOptions,
    MultiFeatureOptions,
  },
  setup() {
    const { getters } = useStoreModule("editor");
    const UIStore = useStoreModule("UI");
    const isShapesEditable = computed(
      () => UIStore.getters.getAccessFlags.isShapesEditable
    );
    const selectedItems = computed(() => getters.getSelectedFeatures);
    const optionsComponent = computed(() => {
      if (selectedItems.value?.length > 1 && isShapesEditable.value) {
        return "MultiFeatureOptions";
      }
      const type =
        selectedItems.value &&
        selectedItems.value.length === 1 &&
        selectedItems.value[0]?.geometry?.type;
      switch (type) {
        case FEATURE_TYPES.Polygon:
        case FEATURE_TYPES.MultiPolygon:
        case FEATURE_TYPES.LineString:
        case FEATURE_TYPES.Point:
        case FEATURE_TYPES.MultiLineString:
          return "FeatureOptions";
        default:
          return "BaseMapOptions";
      }
    });

    return { selectedItems, optionsComponent };
  },
};
</script>

<style lang="scss" scoped>
.details-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-secondary);
  overflow: hidden;
}
</style>
