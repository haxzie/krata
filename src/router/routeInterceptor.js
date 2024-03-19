// import { useStoreModule } from "@/composables/useStoreModule";
import { KRATA_API_TOKEN } from "@/utils/constants";
// import {store} from "@/store"

export default async function routeInterceptor(to, from, next) {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (nearestWithMeta) {
    // Turn the meta tag definitions into actual elements in the head.
    nearestWithMeta.meta.metaTags
      .map((tagDef) => {
        const tag = document.createElement("meta");

        Object.keys(tagDef).forEach((key) => {
          tag.setAttribute(key, tagDef[key]);
        });

        // We use this to track which meta tags we create, so we don't interfere with other ones.
        tag.setAttribute("data-vue-router-controlled", "");

        return tag;
      })
      // Add the meta tags to the document head.
      .forEach((tag) => document.head.appendChild(tag));
  }

  if (to.name === "logout") {
    localStorage.removeItem(KRATA_API_TOKEN);
    next({
      path: "/auth/login",
    });
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // check if the token is present in the localstorage
    if (localStorage.getItem(KRATA_API_TOKEN)) {
      next();
    } else {
      next({
        path: "/auth",
        query: { nextUrl: to.fullPath },
      });
    }
  } else if (to.matched.some((record) => record.meta.redirectIfLoggedIn)) {
    // check if the token is present in the localstorage
    if (localStorage.getItem(KRATA_API_TOKEN)) {
      next({
        path: "/",
      });
    } else {
      next();
    }
  } else {
    next();
  }
}
