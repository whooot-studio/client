import type _auth from "~/lib/auth";

let auth: _auth | undefined = undefined;
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!auth) auth = (await import("~/lib/auth")).default; // Lazy load

  const meta = to.meta.auth;
  if (!meta) return;

  const session = await auth.getSession();

  if (meta.guest === "deny" && !session.data?.user) return abortNavigation();
  if (meta.user === "deny" && session.data?.user) return abortNavigation();
});
