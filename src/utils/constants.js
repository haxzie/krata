import { v4 as uuid } from "uuid";

export const DISTANCE_SCALE = {
  mtrs: {
    name: "Mtrs",
    id: "mtrs",
    scale: 1,
  },
  miles: {
    name: "Miles",
    id: "miles",
    scale: 1609.34,
  },
  kms: {
    name: "Kms",
    id: "kms",
    scale: 1000,
  },
};

export const KRATA_API_TOKEN = "KRATA_API_TOKEN";
export const KRATA_ACTIVE_ORGANISATION = "KRATA_ACTIVE_ORGANISATION";

export const PROJECT_ACTIONS = {
  UPDATE_STATE: "UPDATE_STATE",
  UPDATE_TITLE: "UPDATE_TITLE",
  UPDATE_FEATURES: "UPDATE_FEATURES",
  UPDATE_FEATURE_ORDER: "UPDATE_FEATURE_ORDER",
  DELETE_FEATURES: "DELETE_FEATURES",
  UPDATE_DESCRIPTION: "UPDATE_DESCRIPTION",
  UPDATE_COVER: "UPDATE_COVER",
};

export const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${
  process.env.VUE_APP_GITHUB_CLIENT_ID
}&redirect_uri=https://open.krata.app/auth/login&state=github_${uuid()}&scope=user`;

export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth/identifier?client_id=${
  process.env.VUE_APP_GAUTH_CLIENT_ID
}&prompt=consent&redirect_uri=${process.env.VUE_APP_URL}/auth/login&state=google_${uuid()}&response_type=code&scope=profile email&service=lso&o2v=1&flowName=GeneralOAuthFlow`;
