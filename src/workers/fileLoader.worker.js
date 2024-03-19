/* eslint-disable */
import Feature, { FEATURE_TYPES } from "@/models/Feature.model";
import { expose } from "comlink";
import Papa from "papaparse";
import { fileReader } from "@/utils/FileUtils";
import { omit } from "lodash";
import chroma from "chroma-js";

const removeAltitude = (type, coordinates) => {
  switch (type) {
    case FEATURE_TYPES.Point:
      return coordinates.slice(0, 2);
    case FEATURE_TYPES.LineString:
      return coordinates.map((item) => item.slice(0, 2));
    case FEATURE_TYPES.MultiLineString:
      return coordinates.map((item) => item.map((item) => item.slice(0, 2)));
    case FEATURE_TYPES.Polygon:
      return coordinates.map((item) => item.map((item) => item.slice(0, 2)));
    case FEATURE_TYPES.MultiPolygon:
      return coordinates.map((item) =>
        item.map((item) => item.map((item) => item.slice(0, 2)))
      );
    default:
      return coordinates;
  }
};

const getPossibleNameKey = (properties) => {
  const keys = Object.keys(properties);
  if (keys.indexOf("name") > -1) {
    return "name";
  } else {
    const nameKey = keys.find((key) => key.toLowerCase().includes("name"));
    return nameKey || "name";
  }
};

const extractGeoJSONFeatures = (geoJson) => {
  const { features } = geoJson;
  if (features && features.length > 0) {
    return features.map((item) => {
      const possibleNameKey = getPossibleNameKey(item.properties);
      // add name key
      if (item.properties[possibleNameKey]) {
        item.properties.name = item.properties[possibleNameKey];
      }
      // check for fill colors
      if (item.properties?.fill) {
        try {
          item.properties.fillColor = chroma(item.properties.fill).rgba();
          if (Object.keys(item.properties).indexOf("fill-opacity") > -1) {
            item.properties.fillColor[3] = Math.floor(
              Math.min(item.properties["fill-opacity"] * 255, 255)
            );
          } else {
            item.properties.fillColor[3] = 255;
          }
          // remove the color properties once transformed
          item.properties = omit(item.properties, ["fill", "fill-opacity"]);
        } catch (error) {
          console.error(error);
        }
      }
      // check for stroke colors
      if (item.properties?.stroke) {
        try {
          item.properties.lineColor = chroma(item.properties.stroke).rgba();
          if (Object.keys(item.properties).indexOf("stroke-opacity") > -1) {
            item.properties.lineColor[3] = Math.floor(
              Math.min(item.properties["stroke-opacity"] * 255, 255)
            );
          } else {
            item.properties.lineColor[3] = 255;
          }
          // remove the color properties once transformed
          item.properties = omit(item.properties, ["stroke", "stroke-opacity"]);
        } catch (error) {
          console.error(error);
        }
      }

      return {
        ...item,
        geometry: {
          ...item.geometry,
          coordinates: removeAltitude(
            item.geometry.type,
            item.geometry.coordinates
          ),
        },
        properties: {
          ...Object.keys(item.properties).reduce((result, key) => {
            Object.assign(result, {
              [key]: item.properties[key],
            });
            return result;
          }, {}),
          id: null,
        },
      };
    });
  } else {
    return null;
  }
};

const getFeaturesFromKMLFile = async (geoJson) => {
  try {
    const features = extractGeoJSONFeatures(geoJson);
    return features;
  } catch (error) {
    console.error(error);
  }
};

const getFeaturesFromGeoJSONFile = async (file) => {
  try {
    const text = await fileReader(file);
    const geoJson = JSON.parse(text);
    const features = extractGeoJSONFeatures(geoJson);
    return features;
  } catch (error) {
    console.error(error);
  }
};

const getCSVFileMetaData = async (file) => {
  try {
    const text = await fileReader(file);
    const data = Papa.parse(text, { header: true, dynamicTyping: true });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getFeaturesFromCSVFile = async (
  file,
  latitudeColum,
  longitudeColumn,
  nameColumn
) => {
  try {
    const text = await fileReader(file);
    const data = Papa.parse(text, { header: true, dynamicTyping: true });
    const { data: csvData } = data;
    const features = csvData
      .filter((item) => !!(item[latitudeColum] && item[longitudeColumn]))
      .map((item) => {
        const feature = {
          type: FEATURE_TYPES.Point,
          geometry: {
            type: FEATURE_TYPES.Point,
            coordinates: [item[longitudeColumn], item[latitudeColum]],
          },
          properties: {
            ...Object.keys(item)
              .filter(
                (key) =>
                  [latitudeColum, longitudeColumn, nameColumn].indexOf(key) < 0
              )
              .reduce((result, key) => {
                Object.assign(result, {
                  [key.toLowerCase()]: item[key],
                });
                return result;
              }, {}),
            id: null,
          },
        };
        if (nameColumn && item.hasOwnProperty(nameColumn) && item[nameColumn]) {
          feature.properties.name = item[nameColumn];
        }
        return feature;
      });
    const processedGeoJsonFeatures = extractGeoJSONFeatures({ features });
    return processedGeoJsonFeatures;
  } catch (error) {
    console.error(error);
  }
};

expose({
  getFeaturesFromGeoJSONFile,
  getCSVFileMetaData,
  getFeaturesFromCSVFile,
  getFeaturesFromKMLFile,
});
