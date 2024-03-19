import { PROJECT_ACCESS } from "@/models/Project.model";
import {
  OWNER_ACCESS_FALGS,
  READ_ACCESS_FLAGS,
  WRITE_ACCESS_FLAGS,
} from "./initialState";
import { types } from "./mutations";

export default {
  setShowImportModal: async ({ commit }, show) => {
    commit(types.SET_SHOW_IMPORT_MODAL, show);
  },
  setShowMapSearch: async ({ commit }, show) => {
    commit(types.SET_SHOW_MAP_SEARCH, show);
  },
  setAccessFlags: async ({ commit }, access) => {
    switch (access) {
      case PROJECT_ACCESS.OWNER:
        commit(types.SET_ACCESS_FLAGS, OWNER_ACCESS_FALGS);
        break;
      case PROJECT_ACCESS.WRITE:
        commit(types.SET_ACCESS_FLAGS, WRITE_ACCESS_FLAGS);
        break;
      default:
        commit(types.SET_ACCESS_FLAGS, READ_ACCESS_FLAGS);
        break;
    }
  },
  reset: async ({ commit }) => {
    commit(types.RESET);
  },
};
