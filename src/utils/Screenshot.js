import { store } from "@/store";

export const generateEditorScreenshot = async (
  { quality } = { quality: 0.95 }
) => {
  const start = Date.now();
  const container = document.getElementById("editor-map-view");
  const rect = container.getBoundingClientRect();
  const { width, height } = rect; // width and hieght of the image
  const canvas = document.getElementById("screenshot-canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const drawImageToCanvas = (data) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        resolve();
      };
      img.src = data;
    }).catch(error => {
      console.log(error)
    });
  };

  // get all the canvas elements and generate image out of them
  const baseMap = document
    .getElementById("base-map")
    .querySelector(".mapboxgl-canvas");
  const deckCanvas = document.getElementById("deck-canvas");
  let canvasData = [baseMap, deckCanvas];

  // push the foreground map only if the map labels are on
  const foregroundMap = document
    .getElementById("foreground-map")
    .querySelector(".mapboxgl-canvas");
  const showMapLabels = store.getters["map/getShowMapLabels"];
  if (showMapLabels) {
    canvasData.push(foregroundMap);
  }
  canvasData.filter((item) => !!item);
  for (let i = 0; i < canvasData.length; i++) {
    const canvas = canvasData[i];
    const data = await canvas.toDataURL("image/png");
    await drawImageToCanvas(data);
  }

  ctx.fillText("Created with krata.app", 10, height - 10);
  ctx.fillText("© Mapbox © OpenStreetMap ", width - 150, height - 10);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", quality)
  ).catch(error => console.error(error));
  const end = Date.now();
  console.log(`Screenshot Generated in ${end - start}ms`);

  return blob;
};
