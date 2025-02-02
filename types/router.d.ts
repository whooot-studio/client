import type { RouteMeta } from "vue-router";

type AuthGuardMeta = {
  guest?: "allow" | "deny";
  user?: "allow" | "deny";
};

declare module "vue-router" {
  interface RouteMeta {
    auth?: AuthGuardMeta;
  }
}

import type { PageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";
declare module "../node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    auth?: AuthGuardMeta;
  }
}
