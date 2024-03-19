export default {
    getProjects: (state) => {
        return state.projectIds.map(key => state.projects[key]).sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    },
    getActiveProject: (state) => {
        return state.activeProject;
    },
    getActiveProjectId: (state) => {
        return state.activeProject?.id;
    },
    getActiveProjectAccess: (state) => {
        return state.activeProjectAccess
    }
}