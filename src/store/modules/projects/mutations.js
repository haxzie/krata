import omit from "lodash/omit";

export const types = {
    SET_PROJECTS: 'SET_PROJECTS',
    SET_ACTIVE_PROJECT: 'SET_ACTIVE_PROJECT',
    SET_ACTIVE_PROJECT_ACCESS: 'SET_ACTIVE_PROJECT_ACCESS',
    DELETE_PROJECT: 'SET_DELETE_PROJECT',
    RESET: 'RESET',
}

export default {
    [types.SET_PROJECTS]: (state, projects) => {
        state.projects = projects;
        state.projectIds = Object.keys(projects);
    },
    [types.SET_ACTIVE_PROJECT]: (state, project) => {
        state.activeProject = Object.freeze(project);
    },
    [types.SET_ACTIVE_PROJECT_ACCESS]: (state, access) => {
        state.activeProjectAccess = access;
    },
    [types.DELETE_PROJECT]: (state, projectId) => {
        state.projects =  omit(state.projects, projectId);
        state.projectIds = Object.keys(state.projects);
    },
    [types.RESET]: (state) => {
        state.activeProject = null;
    }
}