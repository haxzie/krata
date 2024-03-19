import { types } from "./mutations";
import Feature, { CASCADABLE_PROPERTIES } from "@/models/Feature.model.js";
import FileSaver from "file-saver";
// import debounce from "lodash/debounce";
import omit from "lodash/omit";
const exportWorker = new Worker(new URL("../../../workers/export.worker.js", import.meta.url));
const fileLoaderWorker = new Worker(new URL("../../../workers/fileLoader.worker.js", import.meta.url));
const geojsonWorker = new Worker(new URL("../../../workers/geojson.worker.js", import.meta.url));
import { wrap } from "comlink";
import tokml from "tokml";
import toGeoJSON from "@mapbox/togeojson";
import { PROJECT_ACTIONS } from "@/utils/constants";
import { generateEditorScreenshot } from "@/utils/Screenshot";
import { fileReader } from "@/utils/FileUtils";
const workerFunctions = wrap(fileLoaderWorker);
const geojsonFunctions = wrap(geojsonWorker);
const exportFunctions = wrap(exportWorker);

const getLastItemIndex = (features) => {
  const indexes = {
    Polygon: 0,
    MultiPolygon: 0,
    LineString: 0,
    Point: 0,
    MultiLineString: 0
  };

  const getIndexFromFeatureName = (feature) => {
    const featureType = feature.geometry.type;
    const featureName = feature.properties.name;
    const regex = new RegExp(`${featureType} ([0-9]+)`);
    if (regex.test(featureName)) {
      const index = parseInt(featureName.match(regex)[1]);
      return index;
    } else {
      return null;
    }
  };

  features.forEach((feature) => {
    let currentIndex = indexes[feature.geometry.type];
    const featureIndex = getIndexFromFeatureName(feature);
    if (featureIndex && featureIndex > currentIndex) {
      indexes[feature.geometry.type] = featureIndex;
    }
  });

  return indexes;
};

// const syncThumbnail = (dispatch) => {
//   dispatch("projects/syncProjectThumbnail", null, { root: true });
// };

// const debouncedSyncThumbnail = debounce(syncThumbnail, 3000);

const sync = (dispatch, action, payload) => {
  dispatch("projects/sync", { action, payload }, { root: true });
  // debouncedSyncThumbnail(dispatch);
};

export default {
  setFilename: ({ commit }, filename) => {
    commit(types.SET_FILENAME, filename);
  },
  syncFileName: ({ state, dispatch }) => {
    const filename = state.filename;
    sync(dispatch, PROJECT_ACTIONS.UPDATE_TITLE, filename);
  },
  setGeoJson: async ({ commit }, geoJson) => {
    commit(types.SET_GEO_JSON, geoJson);
  },
  updateBoundingBox: async ({ commit, getters }, { bbox } = { bbox: null }) => {
    try {
      if (bbox) {
        commit(types.SET_BOUNDING_BOX, bbox);
        return;
      }
      const boundingBox = await geojsonFunctions.getGeoJsonBoundingBox(
        getters.getGeoJson
      );
      commit(types.SET_BOUNDING_BOX, boundingBox);
    } catch (error) {
      console.error(error);
    }
  },
  addGeoJsonFeatures: async (
    { state, commit, dispatch },
    { features, shouldUpdateBBOX, cascadeStyles } = { features: [], cascadeStyles: true, shouldUpdateBBOX: false }
  ) => {
    try {
      const lastItemIndex = getLastItemIndex(Object.values(state.features));
      const featuresToAdd = features.reduce((result, feature, index) => {
        const item = new Feature({
          ...feature,
          properties: {
            ...feature.properties,
            ...((cascadeStyles && state.shouldCascadeFeatureProperties &&
              state.cascadeFeatureProperties[feature.geometry.type]) ||
              {}),
            ...(feature.properties.name?.length
              ? {}
              : {
                  name: `${feature.geometry.type} ${
                    lastItemIndex[feature.geometry.type] + index + 1
                  }`,
                }),
          },
        });
        return {
          ...result,
          [item.properties.id]: { ...item },
        };
      }, {});
      const newFeatures = { ...state.features, ...featuresToAdd };
      const addedFeatureIds = Object.keys(featuresToAdd);
      const newFeatureIds = [
        ...[...addedFeatureIds].reverse(),
        ...state.featureIds,
      ];

      commit(types.SET_FEATURES, {
        features: newFeatures,
        featureIds: newFeatureIds,
      });
      setTimeout(() => {
        commit(types.SET_SELECTED_FEATURE_IDS, addedFeatureIds);
      }, 100);

      if (shouldUpdateBBOX) {
        dispatch("updateBoundingBox");
      }
      // sync with remote server
      sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURES, featuresToAdd);
      sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURE_ORDER, newFeatureIds);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  updateFeatureProperties: async (
    { state, commit, dispatch },
    { featureId, properties, geometry, replaceProperties, shouldSync } = {
      featureId: null,
      properties: {},
      geometry: {},
      replaceProperties: false,
      shouldSync: true,
    }
  ) => {
    const updatedFeature = new Feature({
      ...state.features[featureId],
      geometry: {
        ...state.features[featureId]?.geometry,
        ...geometry,
      },
      properties: {
        ...(replaceProperties ? {} : state.features[featureId].properties),
        ...properties,
      },
    });
    commit(types.SET_FEATURES, {
      features: {
        ...state.features,
        [featureId]: updatedFeature,
      },
      featureIds: state.featureIds,
    });
    if (shouldSync) {
      sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURES, {
        [featureId]: updatedFeature,
      });
    }

    // add to cascadable properties
    if (properties && Object.keys(properties).length) {
      const cascadeFeatureProperties = Object.keys(properties).reduce(
        (result, property) => {
          if (CASCADABLE_PROPERTIES.indexOf(property) > -1) {
            return {
              ...result,
              [property]: properties[property],
            };
          } else {
            return result;
          }
        },
        {}
      );
      dispatch("setCascadeFeatureProperties", {
        featureType: updatedFeature.geometry.type,
        properties: cascadeFeatureProperties,
      });
    }
  },
  updateMultipleFeatureProperties: async (
    { state, commit, dispatch },
    { featureIds, properties, shouldSync } = {
      featureIds: [],
      properties: {},
      shouldSync: false,
    }
  ) => {
    const updatedFeatures = featureIds.reduce((result, featureId) => {
      const updatedFeature = new Feature({
        ...state.features[featureId],
        properties: {
          ...state.features[featureId].properties,
          ...properties,
        },
      });
      return {
        ...result,
        [featureId]: updatedFeature,
      };
    }, {});
    commit(types.SET_FEATURES, {
      features: {
        ...state.features,
        ...updatedFeatures,
      },
      featureIds: state.featureIds,
    });
    if (shouldSync) {
      sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURES, updatedFeatures);
    }
  },
  syncFeatureProperties: async (
    { dispatch, state },
    { featureId, featureIds }
  ) => {
    if (featureIds?.length) {
      const features = featureIds.reduce((result, featureId) => {
        return {
          ...result,
          [featureId]: state.features[featureId],
        };
      }, {});
      sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURES, features);
    } else if (featureId) {
      sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURES, {
        [featureId]: state.features[featureId],
      });
    }
  },
  updateFeaturePosition: async (
    { state, commit, dispatch },
    { fromIndex, toIndex }
  ) => {
    const featureIdsCopy = [...state.featureIds];
    const fi = featureIdsCopy.length - fromIndex - 1;
    const ti = featureIdsCopy.length - toIndex - 1;
    const element = featureIdsCopy[fi];
    featureIdsCopy.splice(fi, 1);
    featureIdsCopy.splice(ti, 0, element);
    commit(types.SET_FEATURE_ID_LIST, featureIdsCopy);
    sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURE_ORDER, featureIdsCopy);
  },
  setFeatures: async ({ commit }, { features, featureIds }) => {
    commit(types.SET_FEATURES, {
      features,
      featureIds,
    });
  },
  setFeatureIdList: async ({ commit }, { featureIds }) => {
    commit(types.SET_FEATURE_ID_LIST, featureIds);
  },
  deleteSelectedFeatures: async ({ state, commit, dispatch }) => {
    const featuresToDelete = [...state.selectedFeatureIds];
    await dispatch("setSelectedFeatureIds", []);
    await dispatch("setHoveredFeatureId", null);
    const featureIds = state.featureIds.filter(
      (id) => featuresToDelete.indexOf(id) === -1
    );
    commit(types.SET_FEATURES, {
      features: omit(state.features, featuresToDelete),
      featureIds,
    });
    sync(dispatch, PROJECT_ACTIONS.DELETE_FEATURES, featuresToDelete);
    sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURE_ORDER, featureIds);
  },
  deleteFeatureById: async ({ state, commit, dispatch }, { featureId }) => {
    // clean up existing feature from records
    if (
      state.selselectedFeatureIds &&
      state.selselectedFeatureIds.indexOf(featureId) > -1
    ) {
      await dispatch(
        "setSelectedFeatureIds",
        state.selselectedFeatureIds.filter((id) => id !== featureId)
      );
    }
    if (state.hoveredFeatureId === featureId) {
      await dispatch("setHoveredFeatureId", null);
    }

    const featureIds = state.featureIds.filter((id) => id !== featureId);
    commit(types.SET_FEATURES, {
      features: omit(state.features, [featureId]),
      featureIds,
    });

    sync(dispatch, PROJECT_ACTIONS.DELETE_FEATURES, [featureId]);
    sync(dispatch, PROJECT_ACTIONS.UPDATE_FEATURE_ORDER, featureIds);
  },
  setActiveTool: async ({ commit }, tool) => {
    commit(types.SET_ACTIVE_TOOL, tool);
  },
  setActiveEditMode: async ({ commit }, { mode, featureId }) => {
    commit(types.SET_SELECTED_FEATURE_IDS, featureId ? [featureId] : []);
    commit(types.SET_ACTIVE_EDIT_MODE, mode);
  },
  setHoveredFeatureId: async ({ commit }, featureId) => {
    commit(types.SET_HOVERED_FEATURE_ID, featureId);
  },
  setSelectedFeatureIds: async ({ commit }, featureIds) => {
    commit(types.SET_SELECTED_FEATURE_IDS, featureIds);
  },
  selectAllFeatures: async ({ state, dispatch }) => {
    await dispatch("setSelectedFeatureIds", state.featureIds);
  },
  customSelectFeatureId: async (
    { commit, state },
    { featureId, deselect, isMultiSelect } = {
      featureId: null,
      deselect: false,
      isMultiSelect: false,
    }
  ) => {
    const featureIds = [...state.featureIds].reverse();
    if (!featureId) return;
    if (deselect) {
      commit(
        types.SET_SELECTED_FEATURE_IDS,
        state.selectedFeatureIds.filter((id) => id !== featureId)
      );
    } else if (isMultiSelect) {
      if (state.selectedFeatureIds.length > 0) {
        let lastItemIndex = state.selectedFeatureIds.reduce((result, item) => {
          const currentItemIndex = featureIds.indexOf(item);
          if (currentItemIndex > result) {
            return currentItemIndex;
          } else {
            return result;
          }
        }, -1);
        if (lastItemIndex > -1) {
          let featureIdIndex = featureIds.indexOf(featureId);
          if (featureIdIndex > lastItemIndex) {
            featureIdIndex += 1;
          }
          const minIndex = Math.min(lastItemIndex, featureIdIndex);
          const maxIndex = Math.max(lastItemIndex, featureIdIndex);
          const selectedIds = featureIds.slice(minIndex, maxIndex);
          commit(types.SET_SELECTED_FEATURE_IDS, [
            ...new Set([...state.selectedFeatureIds, ...selectedIds]),
          ]);
        }
      }
    } else {
      if (state.selectedFeatureIds.indexOf(featureId) > -1) {
        commit(
          types.SET_SELECTED_FEATURE_IDS,
          state.selectedFeatureIds.filter((id) => id !== featureId)
        );
      } else {
        commit(types.SET_SELECTED_FEATURE_IDS, [
          ...state.selectedFeatureIds,
          featureId,
        ]);
      }
    }
  },
  setCascadeFeatureProperties: async (
    { state, commit },
    { featureType, properties }
  ) => {
    commit(
      types.SET_CASCADE_FEATURE_PROPERTIES,
      Object.freeze({
        ...state.cascadeFeatureProperties,
        [featureType]: {
          ...(state.cascadeFeatureProperties[featureType] || {}),
          ...properties,
        },
      })
    );
  },
  setFocusedFeatureId: async ({ commit }, featureId) => {
    commit(types.SET_FOCUSED_FEATURE_ID, featureId);
  },
  saveAsGeoJson: async ({ getters }) => {
    const geoJsonToExport = JSON.parse(JSON.stringify({...getters.getGeoJson}));
    geoJsonToExport.features =
      await exportFunctions.preprocessFeaturesForExport(geoJsonToExport);
    const blob = new Blob([JSON.stringify(geoJsonToExport, null, 2)], {
      type: "application/json",
    });
    FileSaver.saveAs(blob, "mapster.geojson");
  },
  saveAsKML: async ({ getters }) => {
    const geoJsonToExport = getters.getGeoJson;
    geoJsonToExport.features =
      await exportFunctions.preprocessFeaturesForExport(geoJsonToExport);
    const kml = tokml(geoJsonToExport);
    const blob = new Blob([kml], {
      type: "application/vnd.google-earth.kml+xml",
    });
    FileSaver.saveAs(blob, "krata.kml");
  },
  loadKMLFile: async ({ dispatch }, file) => {
    try {
      const text = await fileReader(file);
      // DOM Parser is not available in web workers, so implementing it in here
      const parsedKML = await new DOMParser().parseFromString(text, "text/xml");
      const geoJson = toGeoJSON.kml(parsedKML);
      const features = await workerFunctions.getFeaturesFromKMLFile(geoJson);
      if (features) {
        dispatch("addGeoJsonFeatures", { features, cascadeStyles: false, shouldUpdateBBOX: true });
      }
    } catch (error) {
      console.error(error);
    }
  },
  loadGeoJSONFile: async ({ dispatch }, file) => {
    try {
      const features = await workerFunctions.getFeaturesFromGeoJSONFile(file);
      console.log({ features })
      if (features) {
        dispatch("addGeoJsonFeatures", { features, cascadeStyles: false, shouldUpdateBBOX: true });
      }
    } catch (errors) {
      console.error(errors);
    }
  },
  loadCSVFileMetaData: async (_, file) => {
    try {
      const metaData = await workerFunctions.getCSVFileMetaData(file);
      return metaData;
    } catch (error) {
      return { error: true };
    }
  },
  loadCSVFile: async (
    { dispatch },
    { file, latitudeColumn, longitudeColumn, nameColumn }
  ) => {
    try {
      const features = await workerFunctions.getFeaturesFromCSVFile(
        file,
        latitudeColumn,
        longitudeColumn,
        nameColumn
      );
      console.log(`Features generated from CSV file`);
      if (features) {
        await dispatch("addGeoJsonFeatures", {
          features,
          cascadeStyles: false,
          shouldUpdateBBOX: true,
        });
      }
    } catch (errors) {
      console.error(errors);
    }
  },
  saveAsImage: async ({ commit, getters, rootGetters }) => {
    commit(types.SET_IS_GENERATING_IMAGE, true);
    const project = rootGetters["projects/getActiveProject"];
    const filename =
      project && project.id
        ? `${getters.getFilename
            .split(" ")
            .join("_")}_${new Date().toISOString()}.jpg`
        : "krata-map.jpg";
    const imageBlob = await generateEditorScreenshot({ quality: 1 });
    FileSaver.saveAs(imageBlob, filename);
  },
  loadEditorData: async ({ dispatch }, { title, features }) => {
    dispatch("setFilename", title);
    await dispatch("setFeatures", {
      features: features || {},
      featureIds: (features && Object.keys(features).reverse()) || [],
    });
    dispatch("updateBoundingBox");
  },
  reset: async ({ commit }) => {
    commit(types.RESET);
  },
};
