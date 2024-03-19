import {
  DrawPolygonMode,
  DrawPointMode,
  DrawRectangleMode,
  DrawCircleFromCenterMode,
  DrawLineStringMode,
  ViewMode,
  ModifyMode,
  TransformMode,
  MeasureDistanceMode,
} from "nebula.gl";

export const MAP_TOOLS = {
  select: {
    id: "select",
    name: "Select Tool",
    description: "Helps you select existing shapes, modify, transform or delete them.",
    icon: "SelectIcon",
    cursor: "default",
    shortcut: "v",
    mode: ViewMode,
  },
  polygon: {
    id: "polygon",
    name: "Polygon Tool",
    description: "Helps you draw a Polygon by clicking and specifying the vertices.",
    icon: "PolygonIcon",
    cursor: "crosshair",
    shortcut: "p",
    mode: DrawPolygonMode,
  },
  rectangle: {
    id: "rectangle",
    name: "Rectangle Tool",
    description: "Helps you draw a Rectangle by clicking a start corner and end corner.",
    icon: "RectangleIcon",
    cursor: "crosshair",
    shortcut: "r",
    mode: DrawRectangleMode,
  },
  ellipse: {
    id: "ellipse",
    name: "Ellipse Tool",
    description: "Helps you draw a polygonal Ellipse by clicking a center point and an end point from the center as radius.",
    icon: "EllipseIcon",
    cursor: "crosshair",
    shortcut: "e",
    mode: DrawCircleFromCenterMode,
  },
  line: {
    id: "line",
    name: "LineString Tool",
    description: "Helps you draw a LineString by clicking and specifying the vertices.",
    icon: "LineIcon",
    cursor: "crosshair",
    shortcut: "l",
    mode: DrawLineStringMode,
  },
  point: {
    id: "point",
    name: "Point Tool",
    description: "Helps you draw a single Point by clicking anywhere on the map",
    icon: "DotIcon",
    cursor: "crosshair",
    shortcut: "o",
    mode: DrawPointMode,
  },
  measure: {
    id: "measure",
    name: "Measure Tool",
    description: "Helps you measure distance between multiple points on the map.",
    icon: "MeasureIcon",
    cursor: "crosshair",
    shortcut: "m",
    mode: MeasureDistanceMode,
  },
};

export const EDITING_MODE = {
  transform: {
    id: "transform",
    name: "Transform",
    mode: TransformMode,
    cursor: "crosshair",
  },
  modify: {
    id: "modify",
    name: "Modify",
    mode: ModifyMode,
    cursor: "crosshair",
  },
};

export default function () {
  return {
    filename: "Untitled File",
    geoJson: Object.freeze({
      type: "FeatureCollection",
      features: [],
    }),
    features: {},
    featureIds: [],
    shouldCascadeFeatureProperties: true,
    cascadeFeatureProperties: {},
    boundingBox: null,
    activeTool: "select",
    activeEditMode: null,
    hoveredFeatureId: null,
    selectedFeatureIds: [],
    focusedFeatureId: null,
    isGeneratingImage: false,
  };
}
