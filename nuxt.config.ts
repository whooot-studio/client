// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-15",
  devtools: { enabled: true },
  modules: ["@vueuse/nuxt", "@nuxt/ui"],

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
    clientBundle: {
      icons: [
        "tabler:home",
        "tabler:list",
        "tabler:user-plus",
        "tabler:user",
        "tabler:logout",
        "tabler:rosette-discount-check",
        "tabler:rosette-discount-check-off",
      ],
    },
  },
});
