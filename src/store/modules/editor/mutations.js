import initialState from "./initialState";

export const types = {
  SET_FILENAME: "SET_FILENAME",
  SET_GEO_JSON: "SET_GEO_JSON",
  SET_FEATURES: "SET_FEATURES",
  SET_FEATURE_ID_LIST: "SET_FEATURE_ID_LIST",
  SET_SHOW_MAP_LABELS: "SET_SHOW_MAP_LABELS",
  SET_VIEW_STATE: "SET_VIEW_STATE",
  SET_ACTIVE_TOOL: "SET_ACTIVE_TOOL",
  SET_ACTIVE_EDIT_MODE: "SET_ACTIVE_EDIT_MODE", 
  SET_HOVERED_FEATURE_ID: "SET_HOVERED_FEATURE_ID",
  SET_SELECTED_FEATURE_IDS: "SET_SELECTED_FEATURE_IDS",
  SET_FOCUSED_FEATURE_ID: "SET_FOCUSED_FEATURE_ID",
  SET_BOUNDING_BOX: "SET_BOUNDING_BOX",
  SET_IS_GENERATING_IMAGE: "SET_IS_GENERATING_IMAGE",
  SET_CASCADE_FEATURE_PROPERTIES: "SET_CASCADE_FEATURE_PROPERTIES",
  RESET: "RESET"
};

export default {
  [types.SET_FILENAME]: (state, filename) => {
    state.filename = filename;
  },
  [types.SET_GEO_JSON]: (state, geoJson) => {
    state.geoJson = Object.freeze(geoJson);
  },
  [types.SET_FEATURES]: (state, { features, featureIds }) => {
    if (featureIds) {
      state.featureIds = Object.freeze(featureIds);
    } else {
      state.featureIds = Object.freeze(Object.keys(features));
    }
    state.features = Object.freeze(features);
  },
  [types.SET_FEATURE_ID_LIST]: (state, featureIds) => {
    state.featureIds = Object.freeze(featureIds);
  },
  [types.SET_BOUNDING_BOX]: (state, boundingBox) => {
    state.boundingBox = Object.freeze(boundingBox);
  },
  [types.SET_ACTIVE_TOOL]: (state, tool) => {
    state.activeTool = tool;
  },
  [types.SET_ACTIVE_EDIT_MODE]: (state, mode) => {
    state.activeEditMode = mode;
  },
  [types.SET_HOVERED_FEATURE_ID]: (state, featureId) => {
    state.hoveredFeatureId = featureId;
  },
  [types.SET_SELECTED_FEATURE_IDS]: (state, featureIds) => {
    state.selectedFeatureIds = featureIds;
  },
  [types.SET_FOCUSED_FEATURE_ID]: (state, featureId) => {
    state.focusedFeatureId = featureId;
  },
  [types.SET_IS_GENERATING_IMAGE]: (state, flag) => {
    state.isGeneratingImage = flag;
  },
  [types.SET_CASCADE_FEATURE_PROPERTIES]: (state, cascadeFeatureProperties) => {
    state.cascadeFeatureProperties = Object.freeze(cascadeFeatureProperties);
  },
  [types.RESET]: (state) => {
    Object.entries(initialState()).forEach(([key, value]) => {
      state[key] = value;
    });
  }
};
