export default {
  getUser(state) {
    return state.user;
  },
  getOrganisations(state) {
    return state.organisationsById.map((orgId) => ({
      ...state.organisations[orgId],
      isActive: orgId === state.activeOrganisationId
    }));
  },
  getActiveOrganisation(state) {
    return state.organisations[state.activeOrganisationId];
  },
};
