import { createRouter, createWebHistory } from "vue-router";
import routeInterceptor from "./routeInterceptor";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/pages/MapStudio.vue"),
    },
  ],
});

router.beforeEach(routeInterceptor);
// checks for PWA updates on route change
router.afterEach(() => {
  try {
    window.navigator.serviceWorker.getRegistrations().then((regs) =>
      regs.forEach((reg) => {
        reg.update();
      })
    );
  } catch (error) {
    console.log(`Unable to check for updates on route change`);
    console.error(error);
  }
});


export { router };
