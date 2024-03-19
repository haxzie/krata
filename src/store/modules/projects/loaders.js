export const loadProjectData = async ({ dispatch }, project) => {
    const { state, title, features } = project;
    await dispatch("map/loadMapState", state, { root: true });
    // donot include featureIds, as they can cause difference in data and features
    await dispatch("editor/loadEditorData", { title, features }, { root: true });
}