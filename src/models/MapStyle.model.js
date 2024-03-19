export default class MapStyle {
  constructor({ id, name, url }) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.image = this.generateMapboxThumbnailURL(url);
  }

  generateMapboxThumbnailURL(url) {
    return `https://api.mapbox.com/styles/v1/${url.slice(
      16,
      url.length
    )}/static/-122.4241,37.78,14.25,0,0/200x200?access_token=${
      process.env.VUE_APP_MAPBOX_TOKEN
    }`;
  }
}
