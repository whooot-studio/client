import useAuth from "~/composables/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const meta = to.meta.auth;
  if (!meta) return;

  const { fetchSession, user } = useAuth();
  await fetchSession();

  if (meta.guest === "deny" && !user.value) return abortNavigation();
  if (meta.user === "deny" && user.value) return abortNavigation();
});
