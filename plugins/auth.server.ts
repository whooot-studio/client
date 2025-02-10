import useAuth from "~/composables/auth";

export default defineNuxtPlugin({
  name: "better-auth-fetch-plugin",
  enforce: "pre",
  async setup(nuxtApp) {
    nuxtApp.payload.isCached = Boolean(useRequestEvent()?.context.cache);
    if (
      nuxtApp.payload.serverRendered &&
      !nuxtApp.payload.prerenderedAt &&
      !nuxtApp.payload.isCached
    ) {
      await useAuth().fetchSession();
    }
  },
});
