import { krataApiAuthClient } from "./clients";

export const postSignIn = (email, password) => {
  return krataApiAuthClient.post("/auth/login", {
    email,
    password,
  });
};

export const postSignUp = ({ name, username, token, password }) => {
  return krataApiAuthClient.post("/auth/signup", {
    username,
    name,
    token,
    password,
  });
};

export const postRegister = ({ email }) => {
  return krataApiAuthClient.post("/auth/register", { email });
};

export const postCheckAvailability = ({ username, email }) => {
  return krataApiAuthClient.post("/auth/availability", { username, email });
};

export const getVerifyToken = ({ token }) => {
    return krataApiAuthClient.get(`/auth/verify/${token}`);
}

export const postForgotPassword = ({ email }) => {
  return krataApiAuthClient.post("/auth/forgot-password", { email });
}

export const postResetPassword = ({ token, password }) => {
  return krataApiAuthClient.post("/auth/reset-password", { token, password });
}

export const postCheckResetPasswordToken = ({ token }) => {
  return krataApiAuthClient.post("/auth/check-reset-password-token", { token });
}

export const postLoginWithGitHub = ({ code }) => {
  return krataApiAuthClient.post("/auth/github", { code });
}

export const postLoginWithGoogle = ({ code }) => {
  const client_id = process.env.VUE_APP_GAUTH_CLIENT_ID;
  const redirect_uri = `${process.env.VUE_APP_URL}/auth/login`;
  const response_type = `code`;
  return krataApiAuthClient.post("/auth/google", { code, client_id, redirect_uri, response_type });
}