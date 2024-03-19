import initialState from "./initialState";

export const types = {
  SET_ENABLE_SYNC: "SET_ENABLE_SYNC",
  SET_ACTIVE_MAP_STYLE_ID: "SET_ACTIVE_MAP_STYLE_ID",
  SET_SHOW_MAP_LABELS: "SET_SHOW_MAP_LABELS",
  SET_VIEW_STATE: "SET_VIEW_STATE",
  SET_USE_EXACT_DIMENSIONS: "SET_USE_EXACT_DIMENSIONS",
  SET_SEARCH_LOCATION: "SET_SEARCH_LOCATION",
  SET_TEMPORARY_SEARCH_MARKER_LOCATION: "SET_TEMPORARY_SEARCH_MARKER_LOCATION",
  SET_SHOW_PROPERTIES_POPUP: "SET_SHOW_PROPERTIES_POPUP",
  RESET: "RESET",
};

export default {
  [types.SET_ENABLE_SYNC]: (state, isEnabled) => {
    state.isSyncEnabled = isEnabled;
  },
  [types.SET_ACTIVE_MAP_STYLE_ID]: (state, id) => {
    state.activeMapStyle = id;
  },
  [types.SET_SHOW_PROPERTIES_POPUP]: (state, show) => {
    state.showPropertiesPopup = show;
  },
  [types.SET_SEARCH_LOCATION]: (state, location) => {
    state.searchLocation = location;
  },
  [types.SET_TEMPORARY_SEARCH_MARKER_LOCATION]: (state, location) => {
    state.temporarySearchMarkerLocation = location;
  },
  [types.SET_SHOW_MAP_LABELS]: (state, show) => {
    state.showMapLabels = show;
  },
  [types.SET_VIEW_STATE]: (state, viewState) => {
    state.viewState = viewState;
  },
  [types.SET_USE_EXACT_DIMENSIONS]: (state, value) => {
    state.useExactDimensions = value;
  },
  [types.RESET]: (state) => {
    Object.entries(initialState()).forEach(([key, value]) => {
      state[key] = value;
    });
  },
};
