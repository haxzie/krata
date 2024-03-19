import { krataApiAuthClient } from "./clients";

export const getUserDetails = () => {
    return krataApiAuthClient.get(`/user/me`);
}

export const postUpdateAvatar = (data) => {
    return krataApiAuthClient.post(`/user/avatar`, data);
}

export const putUpdateProfile = ({ name }) => {
    return krataApiAuthClient.put(`/user`, { name });
}

export const postUpdatePassword = ({ password, confirmPassword }) => {
    return krataApiAuthClient.post(`/user/password`, { password, confirmPassword });
}