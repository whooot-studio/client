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
declare module "#app" {
  interface PageMeta {
    auth?: AuthGuardMeta;
  }
}
