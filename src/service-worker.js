/* eslint-disable */

importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js"
  );
  
  workbox.core.setCacheNameDetails({ prefix: "krata-app" });
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  const handler = workbox.precaching.createHandlerBoundToURL("/index.html");
  const navigationRoute = new workbox.routing.NavigationRoute(handler, {});
  workbox.routing.registerRoute(navigationRoute);
  
  
  self.addEventListener("install", (event) => {
    self.skipWaiting();
  });
  
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
  
  