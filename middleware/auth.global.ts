import useAuth from "~/composables/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchSession, loggedIn } = useAuth();

  const meta = to.meta.auth;
  if (!meta) return;

  if (import.meta.client) {
    await fetchSession();
  }

  if (meta.guest === "deny" && !loggedIn.value) return abortNavigation();
  if (meta.user === "deny" && loggedIn.value) return abortNavigation();
});
