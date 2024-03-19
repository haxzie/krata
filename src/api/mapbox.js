import { mapboxApiClient } from "./clients";

export const getMapboxSearch = (query, location) => {
  return mapboxApiClient.get(
    `/geocoding/v5/mapbox.places/${query}.json?${location?`proximity=${[...location].reverse().join(',')}&`:``}access_token=${process.env.VUE_APP_MAPBOX_TOKEN}`
  );
};
