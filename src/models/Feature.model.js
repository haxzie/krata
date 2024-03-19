import { DISTANCE_SCALE } from "@/utils/constants";
import area from "@turf/area";
import length from "@turf/length";
import lineString from "turf-linestring";
import multiPolygon from "turf-multipolygon";
import multilinestring from "turf-multilinestring";
import bbox from "@turf/bbox";
import polygon from "turf-polygon";
import point from "turf-point";
import { v4 as uuid } from "uuid";

export const DEFAULT_PROPERTIES = [
  "id",
  "name",
  "fillColor",
  "lineColor",
  "lineWidth",
  "widthScale",
  "hideFill",
  "hideLine",
  "pointRadius",
  "radiusScale",
  "isHidden",
  "area",
  "perimeter",
  "distance",
  "shape",
];

export const CASCADABLE_PROPERTIES = [
  "fillColor",
  "lineColor",
  "lineWidth",
  "widthScale",
  "pointRadius",
  "radiusScale",
];

export const OMIT_PROPERTIES_FOR_EXPORT = [
  "fillColor",
  "lineColor",
  "lineWidth",
  "widthScale",
  "hideFill",
  "hideLine",
  "isHidden",
  "shape",
];

export const DISPLAYABLE_DEFAULT_PROPERTIES = [
  "id",
  "name",
  "area",
  "perimeter",
  "distance",
];

export const DEFAULT_STYLES = {
  Polygon: {
    fillColor: [66, 135, 245, 100],
    lineColor: [66, 135, 245, 255],
    lineWidth: 3,
    widthScale: DISTANCE_SCALE.mtrs.id,
    hideFill: false,
    hideLine: false,
  },
  LineString: {
    lineColor: [66, 135, 245, 255],
    lineWidth: 3,
    hideLine: false,
    widthScale: DISTANCE_SCALE.mtrs.id,
  },
  Point: {
    fillColor: [255, 255, 255, 100],
    lineColor: [66, 135, 245, 255],
    lineWidth: 10,
    widthScale: DISTANCE_SCALE.mtrs.id,
    radiusScale: DISTANCE_SCALE.mtrs.id,
    pointRadius: 30,
    hideFill: false,
    hideLine: false,
  },
};

export const FEATURE_TYPES = {
  Polygon: "Polygon",
  MultiPolygon: "MultiPolygon",
  LineString: "LineString",
  MultiLineString: "MultiLineString",
  Point: "Point",
};
export default class Feature {
  constructor({ type, geometry, properties, style }) {
    this.type = type;
    this.geometry = geometry;
    this.properties = properties;
    this.style = style;

    if (this.properties) {
      this.properties.id = this.properties.id || uuid();
      this.id = this.properties.id;
      this.properties.name = this.properties.name || `${this.geometry.type}`;
      this.properties.isHidden = this.properties.isHidden || false;
    }

    // attach thedefaults for polygon
    switch (this.geometry.type) {
      case FEATURE_TYPES.Polygon:
      case FEATURE_TYPES.MultiPolygon:
        {
          try {
            if (this.geometry.type === FEATURE_TYPES.MultiPolygon) {
              const mp = new multiPolygon(this.geometry.coordinates);
              this.properties.area = area(mp);
              this.bbox = bbox(mp);
            } else {
              const p = new polygon(this.geometry.coordinates);
              this.properties.area = area(p);
              this.properties.perimeter = length(
                lineString(this.geometry.coordinates[0])
              );
              this.bbox = bbox(p);
            }
          } catch (error) {
            console.log(error);
          }

          // attach default style
          this.properties = {
            ...DEFAULT_STYLES.Polygon,
            ...this.properties,
          };
        }
        break;
      case FEATURE_TYPES.LineString:
        {
          try {
            const ls = new lineString(this.geometry.coordinates);
            this.properties.distance = length(ls);
            this.bbox = bbox(ls);
          } catch (error) {
            console.log(error);
          }
          this.properties = {
            ...DEFAULT_STYLES.LineString,
            ...this.properties,
          };
        }
        break;
      case FEATURE_TYPES.MultiLineString:
        {
          try {
            const mls = new multilinestring(this.geometry.coordinates);
            this.properties.distance = length(mls);
            this.bbox = bbox(mls);
          } catch (error) {
            console.log(error);
          }
          this.properties = {
            ...DEFAULT_STYLES.LineString,
            ...this.properties,
          };
        }
        break;
      case FEATURE_TYPES.Point:
        {
          try {
            const p = new point(this.geometry.coordinates);
            this.bbox = bbox(p);
          } catch (error) {
            console.error(error);
          }
          this.properties = {
            ...DEFAULT_STYLES.Point,
            ...this.properties,
          };
        }
        break;
    }
  }
}
