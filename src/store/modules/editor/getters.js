// import { adjustOpacity } from "@/utils/ColorUtils";

import { CASCADABLE_PROPERTIES } from "@/models/Feature.model";
import { adjustOpacity } from "@/utils/ColorUtils";
import isEqual from "lodash/isEqual";

export default {
  getFilename: (state) => {
    return state.filename;
  },

  getGeoJson: (state) => {
    const shouldFadeUnselected = state.selectedFeatureIds.length > 0;
    return {
      type: "FeatureCollection",
      features: [...state.featureIds]
        .filter((featureId) => {
          if (
            state.features[featureId].properties.isHidden ||
            (state.activeEditMode &&
              state.selectedFeatureIds.indexOf(featureId) > -1)
          ) {
            return false;
          } else {
            return true;
          }
        })
        .map((item) => {
          const isSelected = state.selectedFeatureIds.indexOf(item) > -1;
          const properties = state.features[item].properties;
          return {
            ...state.features[item],
            properties: {
              ...properties,
              ...(shouldFadeUnselected && !isSelected && properties.fillColor
                ? {
                    fillColor: adjustOpacity(
                      state.features[item].properties.fillColor,
                      0.2
                    ),
                  }
                : {}),
              ...(shouldFadeUnselected && !isSelected && properties.lineColor
                ? {
                    lineColor: adjustOpacity(
                      state.features[item].properties.lineColor,
                      0.2
                    ),
                  }
                : {}),
            },
          };
        }),
    };
  },

  getFeatures: (state) => {
    return [...state.featureIds].reverse().map((item) => {
      const isSelected = state.selectedFeatureIds.indexOf(item) > -1;
      return {
        ...state.features[item],
        isSelected,
      };
    });
  },

  getActiveEditMode: (state) => {
    return state.activeEditMode;
  },

  getActiveTool: (state) => {
    return state.activeTool;
  },

  getHoveredFeatureId: (state) => {
    return state.hoveredFeatureId;
  },

  getSelectedFeatureIds: (state) => {
    return state.selectedFeatureIds || [];
  },

  getGroupedPropertiesFromSelected: (state) => {
    const groupedProperties = {};
    state.selectedFeatureIds.forEach((featureId) => {
      const properties = state.features[featureId].properties;
      CASCADABLE_PROPERTIES.forEach((key) => {
        if (groupedProperties[key] === undefined) {
          groupedProperties[key] = [
            {
              featureIds: [featureId],
              value: properties[key],
            },
          ];
        } else {
          const group = groupedProperties[key].find((item) =>
            isEqual(item.value, properties[key])
          );
          if (group) {
            group.featureIds.push(featureId);
          } else {
            groupedProperties[key].push({
              featureIds: [featureId],
              value: properties[key],
            });
          }
        }
      });
    });
    return groupedProperties;
  },

  getSelectedFeatures: (state) => {
    return (
      state.selectedFeatureIds &&
      state.selectedFeatureIds.map((id) => state.features[id])
    );
  },

  getFocusedFeature: (state) => {
    return state.focusedFeatureId && state.features[state.focusedFeatureId];
  },

  isGeneratingImgage: (state) => {
    return state.isGeneratingImage;
  },

  getBoundingBox: (state) => {
    return state.boundingBox;
  },
};
