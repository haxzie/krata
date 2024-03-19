import { krataApiClient } from "./clients";

export const getAllProjects = ({ organisation } = { organisation: null }) => {
  return krataApiClient.get("/project", { params: { organisation } });
};

export const getProjectDetails = (projectId) => {
  return krataApiClient.get(`/project/${projectId}`);
};

export const getProjectPreview = (projectId) => {
  return krataApiClient.get(`/public/${projectId}`);
};

export const postCreateProject = ({ organisation }) => {
  return krataApiClient.post("/project", { organisation });
};

export const patchUpdateProject = (projectId, payload) => {
  return krataApiClient.patch(`/project/${projectId}`, payload);
};

export const deleteProject = (projectId) => {
  return krataApiClient.delete(`/project/${projectId}`);
};

export const postUpdateThumbnail = (projectId, payload) => {
  return krataApiClient.post(`/project/${projectId}/thumbnail`, payload, {
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  });
};

export const postPublishProject = (projectId, payload) => {
  return krataApiClient.post(`/project/${projectId}/publish`, payload);
};
