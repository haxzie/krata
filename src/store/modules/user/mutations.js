export const types = {
    SET_USER: 'SET_USER',
    SET_ORGANISATIONS: 'SET_ORGANISATIONS',
    SET_ACTIVE_ORGANISATION_ID: 'SET_ACTIVE_ORGANISATION_ID'
}

export default {
    [types.SET_USER](state, user) {
        state.user = user
    },
    [types.SET_ORGANISATIONS](state, orgs) {
        state.organisations = orgs;
        state.organisationsById = Object.keys(orgs);
    },
    [types.SET_ACTIVE_ORGANISATION_ID](state, orgId) {
        state.activeOrganisationId = orgId;
    }
}