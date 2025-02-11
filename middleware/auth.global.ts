import { defu } from "defu";
import useAuth from "~/composables/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchSession, loggedIn } = useAuth();

  const meta = defu(to.meta.auth, {
    guest: "allow",
    user: "allow",
  });

  await fetchSession();
  if (meta.guest === "deny" && !loggedIn.value) return abortNavigation();
  if (meta.user === "deny" && loggedIn.value) return abortNavigation();
});
