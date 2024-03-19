import initialState from "./initialState.js";
import actions from "./actions.js";
import mutations from "./mutations.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations,
};
