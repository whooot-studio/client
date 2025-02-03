// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-15",
  devtools: { enabled: true },
  modules: ["@vueuse/nuxt", "@nuxt/ui"],

  ssr: false,

  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      api: {
        host: "",
        port: "",
        secure: "",
      },

      client: {
        url: "",
      },
    },
  },

  icon: {
    serverBundle: {
      collections: ["tabler", "logos"],
    },
  },
});
