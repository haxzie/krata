import { PROJECT_ACCESS } from "@/models/Project.model";
import { PROJECT_ACTIONS } from "@/utils/constants";
import { types } from "./mutations";

const sync = (state, dispatch) => {
  if (!state.isSyncEnabled) return; // donot sync if the state is not loaded
  dispatch(
    "projects/sync",
    {
      action: PROJECT_ACTIONS.UPDATE_STATE,
      payload: {
        mapStyleId: state.activeMapStyle,
        showMapLables: state.showMapLabels,
        useExactDimensions: state.useExactDimensions,
        showPropertiesPopup: state.showPropertiesPopup,
      },
    },
    { root: true }
  );
};

export default {
  setActiveMapStyleId: async ({ commit, state, rootGetters, dispatch }, id) => {
    commit(types.SET_ACTIVE_MAP_STYLE_ID, id);
    if (
      rootGetters["projects/getActiveProjectAccess"] !== PROJECT_ACCESS.READ
    ) {
      sync(state, dispatch);
    }
  },

  setShowMapLabels: async ({ commit, state, rootGetters, dispatch }, show) => {
    commit(types.SET_SHOW_MAP_LABELS, show);
    if (
      rootGetters["projects/getActiveProjectAccess"] !== PROJECT_ACCESS.READ
    ) {
      sync(state, dispatch);
    }
  },

  setUseExactDimensions: ({ commit, state, rootGetters, dispatch }, value) => {
    commit(types.SET_USE_EXACT_DIMENSIONS, value);
    if (
      rootGetters["projects/getActiveProjectAccess"] !== PROJECT_ACCESS.READ
    ) {
      sync(state, dispatch);
    }
  },

  setShowPropertiesPopup: async (
    { rootGetters, commit, state, dispatch },
    show
  ) => {
    commit(types.SET_SHOW_PROPERTIES_POPUP, show);
    if (
      rootGetters["projects/getActiveProjectAccess"] !== PROJECT_ACCESS.READ
    ) {
      sync(state, dispatch);
    }
  },

  setSearchLocation: ({ commit }, location) => {
    commit(types.SET_SEARCH_LOCATION, location);
  },

  setTemporarySearchMarkerLocation: ({ commit }, location) => {
    commit(types.SET_TEMPORARY_SEARCH_MARKER_LOCATION, location);
    setTimeout(() => {
      commit(types.SET_TEMPORARY_SEARCH_MARKER_LOCATION, null);
    }, 2000);
  },

  loadMapState: async ({ dispatch, commit }, mapState) => {
    if (mapState) {
      const { mapStyleId, showMapLables, viewState, useExactDimensions } =
        mapState;
      if (mapStyleId) {
        dispatch("setActiveMapStyleId", mapStyleId);
      }
      dispatch("setShowMapLabels", !!showMapLables);
      if (viewState) {
        dispatch("setViewState", viewState);
      }
      dispatch("setUseExactDimensions", !!useExactDimensions);
      dispatch("setShowPropertiesPopup", false);
    }
    commit(types.SET_ENABLE_SYNC, true);
  },
  reset: async ({ commit }) => {
    commit(types.RESET);
  },
};
