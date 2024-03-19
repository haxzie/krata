import MapStyle from "../../../models/MapStyle.model";
import { MAP_STYLES } from "./initialState";

export default {
  /**
   * @returns {Object} Object conaining key value paired map style object
   */
  getAllMapStyles: () => {
    return MAP_STYLES.reduce((result, next) => {
      result[next.id] = new MapStyle({ ...next });
      return result;
    }, {});
  },

  /**
   *
   * @param {Object} state
   * @returns {String} id of the active map style
   */
  getActiveMapStyleId: (state) => {
    return state.activeMapStyle;
  },

  /**
   *
   * @param {Object} state
   * @param {Object} getters
   * @returns {String} URL for the active map style
   */
  getActiveMapStyleURL: (state, getters) => {
    return getters["getAllMapStyles"][state.activeMapStyle]?.url;
  },

  getShowMapLabels: (state) => {
    return state.showMapLabels;
  },
  getViewState: (state) => {
    return state.viewState;
  },
  getUseExactDimensions: (state) => {
    return state.useExactDimensions;
  },
  getShowPropertiesPopup: (state) => {
    return state.showPropertiesPopup;
  },
  getSearchLocation: (state) => {
    return state.searchLocation;
  },
  getTemporarySearchMarkerLocation: (state) => {
    return state.temporarySearchMarkerLocation;
  },
};
