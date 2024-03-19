const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const plugins = [];

if (process.env.VUE_APP_ENABLE_BUNDLE_ANALYZER === 'true') {
  plugins.push(new BundleAnalyzerPlugin())
}


// plugins.push(
//   new WorkerPlugin({
//     filename: "[name].[contenthash].js",
//     chunkFilename: "[name].[contenthash].js",
//     globalObject: "self",
//   })
// );


module.exports = {
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()],
    plugins,
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      // @/ is an alias to src/
      // so this assumes you have a file named `src/variables.sass`
      // Note: this option is named as "prependData" in sass-loader v8
      scss: {
        additionalData: `@import "~@/styles/setup/_variables.scss";`,
      },
    },
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "./src/service-worker.js",
      // the service worker will only cache chunks below 5MB
      // please refer to the bundle size to make sure chunks do not cross this threshould
      // or else it might cause PWA update issues
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      // ...other Workbox options...
    },
  },
};
