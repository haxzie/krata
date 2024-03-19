import { KRATA_API_TOKEN } from "@/utils/constants";

const getAuthToken = () => {
  return localStorage.getItem(KRATA_API_TOKEN);
};

// intercepts requests to add Authorization token
const authInterceptor = (config) => {
  config.headers["Authorization"] = `${getAuthToken()}`;
  config.headers["Content-Type"] = "application/json";
  return config;
};

export default authInterceptor;
