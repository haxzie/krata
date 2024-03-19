<template>
  <div class="feature-appearences">
    <v-section v-if="enableFillColor" :title="'Fill Color'">
      <v-color-picker
        :color="feature.properties.fillColor"
        :hide="feature.properties.hideFill"
        @onChangeColor="updateFillColor"
        @onChangeHide="updateHideFill"
      />
    </v-section>
    <v-section v-if="enableLineProperties" :title="'Line Color'">
      <v-color-picker
        :color="feature.properties.lineColor"
        :hide="feature.properties.hideLine"
        @onChangeColor="updateLineColor"
        @onChangeHide="updateHideLine"
      />
    </v-section>
    <!-- <v-section v-if="enableLineProperties" :title="'Line Width'">
      <v-scale-input
        :value="feature.properties.lineWidth"
        :scale="feature.properties.widthScale"
        @onWidthChange="updateLineWidth"
        @onScaleChange="updateWidthScale"
      />
    </v-section> -->
    <v-section v-if="enablePointProperties" :title="'Point Radius'">
      <v-scale-input
        :value="feature.properties.pointRadius"
        :scale="feature.properties.radiusScale"
        :icon="'RadiusIcon'"
        @onWidthChange="updatePointRadius"
        @onScaleChange="updateRadiusScale"
      />
    </v-section>
  </div>
</template>

<script>
import VSection from "@/components/base/v-section.vue";
import VColorPicker from "@/components/base/v-color-picker.vue";
import VScaleInput from "@/components/base/v-scale-input.vue";
import { FEATURE_TYPES } from "@/models/Feature.model";
import { computed } from "vue";
import { useStoreModule } from "@/composables/useStoreModule.js";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";

export default {
  components: {
    VSection,
    VColorPicker,
    VScaleInput,
  },
  props: {
    feature: {
      typeo: Object,
      required: true,
    },
  },
  setup(props) {
    const featureType = computed(
      () => FEATURE_TYPES[props.feature.geometry.type]
    );
    const enableFillColor = computed(() => {
      return (
        featureType.value === FEATURE_TYPES.Polygon ||
        featureType.value === FEATURE_TYPES.MultiPolygon ||
        featureType.value === FEATURE_TYPES.Point
      );
    });

    const enableLineProperties = computed(() => {
      return (
        featureType.value === FEATURE_TYPES.Polygon ||
        featureType.value === FEATURE_TYPES.MultiPolygon ||
        featureType.value === FEATURE_TYPES.Point ||
        featureType.value === FEATURE_TYPES.LineString ||
        featureType.value === FEATURE_TYPES.MultiLineString
      );
    });

    const enablePointProperties = computed(() => {
      return featureType.value === FEATURE_TYPES.Point;
    });

    const { actions } = useStoreModule("editor");

    const debouncedFeatureSync = debounce(() => {
      actions.syncFeatureProperties({ featureId: props.feature.properties.id });
    }, 500);

    const updateFillColor = (color) => {
      if (!isEqual(props.feature.properties.fillColor, color)) {
        actions.updateFeatureProperties({
          featureId: props.feature.properties.id,
          properties: { fillColor: color },
          shouldSync: false,
        });
        debouncedFeatureSync();
      }
    };

    const updateHideFill = (isHidden) => {
      actions.updateFeatureProperties({
        featureId: props.feature.properties.id,
        properties: { hideFill: isHidden },
        shouldSync: false,
      });
      debouncedFeatureSync();
    };

    const updateLineColor = (color) => {
      if (!isEqual(props.feature.properties.lineColor, color)) {
        actions.updateFeatureProperties({
          featureId: props.feature.properties.id,
          properties: { lineColor: color },
          shouldSync: false,
        });
        debouncedFeatureSync();
      }
    };

    const updateHideLine = (isHidden) => {
      actions.updateFeatureProperties({
        featureId: props.feature.properties.id,
        properties: { hideLine: isHidden },
        shouldSync: false,
      });
      debouncedFeatureSync();
    };

    const updateLineWidth = (width) => {
      if (!isEqual(props.feature.properties.lineWidth, width)) {
        actions.updateFeatureProperties({
          featureId: props.feature.properties.id,
          properties: { lineWidth: width },
          shouldSync: false,
        });
        debouncedFeatureSync();
      }
    };

    const updatePointRadius = (radius) => {
      if (!isEqual(props.feature.properties.pointRadius, radius)) {
        actions.updateFeatureProperties({
          featureId: props.feature.properties.id,
          properties: { pointRadius: radius },
          shouldSync: false,
        });
        debouncedFeatureSync();
      }
    };

    const updateWidthScale = (scale) => {
      actions.updateFeatureProperties({
        featureId: props.feature.properties.id,
        properties: { widthScale: scale, lineWidth: 1 },
        shouldSync: false,
      });
      debouncedFeatureSync();
    };

    const updateRadiusScale = (scale) => {
      actions.updateFeatureProperties({
        featureId: props.feature.properties.id,
        properties: { radiusScale: scale, pointRadius: 1 },
        shouldSync: false,
      });
      debouncedFeatureSync();
    };

    return {
      FEATURE_TYPES,
      enableFillColor,
      featureType,
      enableLineProperties,
      updateFillColor,
      updateLineColor,
      updateLineWidth,
      updateHideFill,
      updateHideLine,
      enablePointProperties,
      updatePointRadius,
      updateWidthScale,
      updateRadiusScale,
    };
  },
};
</script>

<style lang="scss" scoped>
.feature-appearences {
  display: flex;
  flex-direction: column;
}
</style>
