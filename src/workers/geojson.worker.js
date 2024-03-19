import { expose } from "comlink";
import bbox from "@turf/bbox";

const getGeoJsonBoundingBox = (geoJson) => {
  try {
    const box = bbox(geoJson);
    return [
      [box[0], box[1]],
      [box[2], box[3]],
    ];
  } catch (error) {
    console.error(error);
    return false;
  }
};


expose({ getGeoJsonBoundingBox });
