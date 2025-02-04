import useAuth from "~/composables/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return; // Run only on client-side

  const auth = useAuth();

  const meta = to.meta.auth;
  if (!meta) return;

  const session = await auth.getSession();

  if (meta.guest === "deny" && !session.data?.user) return abortNavigation();
  if (meta.user === "deny" && session.data?.user) return abortNavigation();
});
