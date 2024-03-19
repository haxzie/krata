import { krataApiClient } from "./clients";

export const postCreateWorkspace = ({ name }) => {
    return krataApiClient.post(`/organisation`, { name });
}

export const postUpdateWorkspace = ({ organisation, name }) => {
    return krataApiClient.put(`/organisation/${organisation}`, { name });
}

export const getWorkspaceDetails = ({ organisation }) => {
    return krataApiClient.get(`/organisation/${organisation}`);
}

export const deleteOrganisation = ({ organisation }) => {
    return krataApiClient.delete(`/organisation/${organisation}`);
}

export const putUpdateWorkspace = ({ organisation, name }) => {
    return krataApiClient.put(`/organisation/${organisation}`, { name });
}