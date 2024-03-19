import { getUserDetails } from "@/api/user";
import { deleteOrganisation } from "@/api/workspace";
import { omit } from "lodash";
import { types } from "./mutations";
import { KRATA_ACTIVE_ORGANISATION } from "@/utils/constants";

export default {
  fetchUserDetails: async (
    { commit, dispatch },
    { activeOrganisationId } = { activeOrganisationId: null }
  ) => {
    try {
      const { status, data } = await getUserDetails();
      if (status === 200) {
        const user = data.data;
        commit(types.SET_USER, user);
        const organisations = user.organisations.reduce((result, item) => {
          return {
            ...result,
            [item._id]: {
              id: item._id,
              ...item,
            },
          };
        }, {});
        commit(types.SET_ORGANISATIONS, organisations);
        if (activeOrganisationId) {
          commit(types.SET_ACTIVE_ORGANISATION_ID, activeOrganisationId);
        } else {
          const orgIds = Object.keys(organisations);
          const savedActiveOrgId = localStorage.getItem(
            KRATA_ACTIVE_ORGANISATION
          );
          if (savedActiveOrgId && orgIds.includes(savedActiveOrgId)) {
            commit(types.SET_ACTIVE_ORGANISATION_ID, savedActiveOrgId);
          } else {
            commit(
              types.SET_ACTIVE_ORGANISATION_ID,
              Object.keys(organisations)[0]
            );
            localStorage.setItem(KRATA_ACTIVE_ORGANISATION, null);
          }
        }
        dispatch("projects/reset", null, { root: true });
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  },

  setActiveOrganisationId: async ({ commit }, id) => {
    commit(types.SET_ACTIVE_ORGANISATION_ID, id);
    localStorage.setItem(KRATA_ACTIVE_ORGANISATION, id);
  },

  deleteActiveOrganisation: async ({ commit, state }) => {
    try {
      const { status } = await deleteOrganisation({
        organisation: state.activeOrganisationId,
      });
      if (status === 200) {
        const orgToDelete = state.activeOrganisationId;
        commit(
          types.SET_ACTIVE_ORGANISATION_ID,
          state.organisationsById.filter((item) => item !== orgToDelete)[0]
        );
        commit(
          types.SET_ORGANISATIONS,
          omit({ ...state.organisations }, [orgToDelete])
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  updateActiveOrganisation: async ({ commit, state }, { name }) => {
    const updatedOrgs = {
      ...state.organisations,
      [state.activeOrganisationId]: {
        ...state.organisations[state.activeOrganisationId],
        name,
      },
    };
    commit(types.SET_ORGANISATIONS, updatedOrgs);
  },

  updateUserDetails: async ({ state, commit }, data) => {
    commit(types.SET_USER, {
      ...state.user,
      ...data,
    });
  },
};
