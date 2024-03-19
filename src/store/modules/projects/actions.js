import {
  // deleteProject,
  // patchUpdateProject,
  // postPublishProject,
  // postUpdateThumbnail,
} from "@/api/project";
import Project, { PROJECT_ACCESS } from "@/models/Project.model";
import { loadProjectData } from "./loaders";
import { types } from "./mutations";
// import { generateEditorScreenshot } from "@/utils/Screenshot";
import { v4 as uuid } from "uuid";

export default {
  initializeProject: async ({ dispatch, commit }) => {
    try {
      const project = new Project({
        _id: uuid(),
        title: "Untitled Project",
        description: "",
        state: {},
        featureIds: [],
        features: {},
        createdBy: null,
        isArchived: false,
        lastOpenedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cover: null,
      });
      commit(types.SET_ACTIVE_PROJECT, project);
      dispatch("UI/setAccessFlags", PROJECT_ACCESS.OWNER, { root: true });
      await loadProjectData({ dispatch }, project);
      return project;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  /**
   * This action is used to update the project state in the backend.
   * It is called whenever the project state is updated in the editor.
   * You can replace this with local logic or server logic.
   */
  sync: async (_, { action, payload }) => {
    // sync is disabled right now
    if (process.env.DISABLE_SYNC) return;
    // const projectId = state.activeProject?.id;
    console.log({ action, payload })
    try {
      // await patchUpdateProject(projectId, {
      //   action,
      //   payload,
      // });
    } catch (error) {
      console.error(error);
    }
  },

  // syncProjectThumbnail: async ({ state }) => {
  //   try {
  //     const project = state.activeProject;
  //     const imageBlob = await generateEditorScreenshot({ quality: 0.2 });
  //     const formData = new FormData();
  //     formData.append("file", imageBlob);
  //     const { status } = await postUpdateThumbnail(project.id, formData);
  //     if (status === 200) {
  //       console.log(`Thumbnail updated successfully`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },

  // publishMap: async ({ state, dispatch }, { title, description }) => {
  //   try {
  //     // generate thumbnail
  //     await dispatch("editor/updateBoundingBox", null, { root: true });
  //     const project = state.activeProject;
  //     const imageBlob = await generateEditorScreenshot({ quality: 0.5 });
  //     const formData = new FormData();
  //     formData.append("file", imageBlob);
  //     formData.append("title", title);
  //     formData.append("description", description);
  //     const { status } = await postPublishProject(project.id, formData);
  //     if (status === 200) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return false;
  //   }
  // },

  // setProjects: async ({ commit }, projectList) => {
  //   const projects = projectList.reduce((result, _project) => {
  //     const project = new Project(_project);
  //     result[project.id] = project;
  //     return result;
  //   }, {});
  //   commit(types.SET_PROJECTS, projects);
  // },

  // deleteProject: async ({ commit }, projectId) => {
  //   try {
  //     commit(types.DELETE_PROJECT, projectId);
  //     await deleteProject(projectId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },

  clearProjects: async ({ commit }) => {
    commit(types.SET_PROJECTS, {});
  },

  reset: async ({ commit, dispatch }) => {
    dispatch("editor/reset", null, { root: true });
    dispatch("map/reset", null, { root: true });
    dispatch("UI/reset", null, { root: true });
    commit(types.RESET);
  },
};
