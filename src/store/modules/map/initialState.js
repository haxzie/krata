export const MAP_STYLES = [
  {
    id: "mapbox-simple",
    name: "Simple",
    url: "mapbox://styles/haxzie/ck2yi2gwu3gpx1co4b9ivyhbl",
  },
  {
    id: "mapbox-satellite-streets",
    name: "Satellite-Streets",
    url: "mapbox://styles/mapbox/satellite-streets-v11",
  },
  {
    id: "mapbox-black-and-white",
    name: "Black and White",
    url: "mapbox://styles/haxzie/ckgt77gyq0vyt1amneqvdgmra",
  },
  {
    id: "mapbox-lights",
    name: "Light",
    url: "mapbox://styles/haxzie/ck35bh5u809rl1cmsgwk9uow1",
  },
  {
    id: "mapbox-dark",
    name: "Dark",
    url: "mapbox://styles/haxzie/ck35bhm884p391cm7k0pj0p4g",
  },
  {
    id: "mapbox-frozen-city",
    name: "Frozen City",
    url: "mapbox://styles/haxzie/ck0aovhaa389j1cpdls6va2f1",
  },
  {
    id: "mapbox-morning-star",
    name: "Morning Snow",
    url: "mapbox://styles/haxzie/ck0cctlg503xe1co6hmx1kunx",
  },
];

export const DEFAULT_MAP_STYLE = "mapbox-simple";

export default function () {
  return {
    mapStyles: MAP_STYLES,
    activeMapStyle: DEFAULT_MAP_STYLE,
    isSyncEnabled: false, // holds all sync untill the state is loaded
    showMapLabels: true,
    useExactDimensions: false,
    searchLocation: null,
    temporarySearchMarkerLocation: null,
    showPropertiesPopup: true,
    geojson: {
      type: "FeatureCollection",
      features: [],
    }
  };
}
