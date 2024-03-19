import initialState from "./initialState";

export const types = {
  SET_SHOW_IMPORT_MODAL: "SET_SHOW_IMPORT_MODAL",
  SET_ACCESS_FLAGS: "SET_ACCESS_FLAGS",
  SET_SHOW_MAP_SEARCH: "SET_SHOW_MAP_SEARCH",
  RESET: "RESET",
};

export default {
  [types.SET_SHOW_IMPORT_MODAL]: (state, show) => {
    state.showImportModal = show;
  },
  [types.SET_SHOW_MAP_SEARCH]: (state, show) => {
    state.showMapSearch = show;
  },
  [types.SET_ACCESS_FLAGS]: (state, flags) => {
    state.accessFlags = Object.freeze({
      ...state.accessFlags,
      ...flags,
    });
  },
  [types.RESET]: (state) => {
    Object.entries(initialState()).forEach(([key, value]) => {
      state[key] = value;
    });
  },
};
