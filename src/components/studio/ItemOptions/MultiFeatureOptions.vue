<template>
  <div class="multi-feature-options">
    <div class="header">
      <h4>{{ selectedItemsCount }} items selected</h4>
    </div>
    <div class="scroll-container">
      <v-section :title="'Fill Colors'">
        <div class="color-picker-grid">
          <vColorPickerSimple
            v-for="(property, key) in groupedProperties.fillColor"
            :key="`fill_color_${key}`"
            :color="property.value"
            @onChangeColor="(color) => updateFillColor(property, color)"
          />
        </div>
      </v-section>
      <v-section :title="'Line Colors'">
        <div class="color-picker-grid">
          <vColorPickerSimple
            v-for="(property, key) in groupedProperties.lineColor"
            :key="`line_color_${key}`"
            :color="property.value"
            @onChangeColor="(color) => updateLineColor(property, color)"
          />
        </div>
      </v-section>
    </div>
  </div>
</template>

<script>
import { useStoreModule } from "@/composables/useStoreModule";
import { computed, defineComponent } from "vue";
import VSection from "@/components/base/v-section.vue";
import vColorPickerSimple from "@/components/base/v-color-picker-simple.vue";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";

export default defineComponent({
  components: {
    VSection,
    vColorPickerSimple,
  },
  setup() {
    const EditorStore = useStoreModule("editor");
    const selectedItemsCount = computed(
      () => EditorStore.getters.getSelectedFeatureIds?.length
    );
    const groupedProperties = computed(
      () => EditorStore.getters.getGroupedPropertiesFromSelected
    );

    const debouncedFeatureSync = debounce((featureIds) => {
      EditorStore.actions.syncFeatureProperties({ featureIds });
    }, 500);

    const updateFillColor = (property, color) => {
      if (!isEqual(property.value, color)) {
        EditorStore.actions.updateMultipleFeatureProperties({
          featureIds: property.featureIds,
          properties: {
            fillColor: color,
          },
          shouldSync: false,
        });
        debouncedFeatureSync(property.featureIds);
      }
    };

    const updateLineColor = (property, color) => {
      if (!isEqual(property.value, color)) {
        EditorStore.actions.updateMultipleFeatureProperties({
          featureIds: property.featureIds,
          properties: {
            lineColor: color,
          },
          shouldSync: false,
        });
        debouncedFeatureSync(property.featureIds);
      }
    };

    return {
      selectedItemsCount,
      groupedProperties,
      updateFillColor,
      updateLineColor,
    };
  },
});
</script>

<style lang="scss" scoped>
.multi-feature-options {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .header {
    padding: 10px;
    border-bottom: 1px solid var(--color-secondary-light);
    display: flex;
    align-items: center;
    h4 {
      font-weight: bold;
    }
  }

  .scroll-container {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .color-picker-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    column-gap: 2px;
    row-gap: 2px;
  }
}
</style>
