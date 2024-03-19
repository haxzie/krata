import chroma from "chroma-js";
import { omit } from "lodash";
import { expose } from "comlink";

const preprocessFeaturesForExport = ({ features }) => {
  const processedFeatures = features.map((item) => {
    const { properties } = item;
    // extract fill colors to hex
    const fillOpacity = properties.fillColor
      ? Number((properties.fillColor[3] / 255).toFixed(2))
      : 0;
    const fill = properties.fillColor
      ? chroma(`rgb(${properties.fillColor.slice(0, 3).join(",")})`).hex()
      : "#ffffff";
    // extract stroke colors to hex
    const strokeOpacity = Number((properties.lineColor[3] / 255).toFixed(2));
    const stroke = chroma(
      `rgb(${properties.lineColor.slice(0, 3).join(",")})`
    ).hex();

    // remove the color properties once transformed
    const processedProperties = omit(properties, ["fillColor", "lineColor"]);

    return {
      ...item,
      properties: {
        ...processedProperties,
        fill,
        "fill-opacity": fillOpacity,
        stroke,
        "stroke-opacity": strokeOpacity,
      },
    };
  });
  return processedFeatures;
};

expose({ preprocessFeaturesForExport });
