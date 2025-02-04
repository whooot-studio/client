import useAuth from "~/composables/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth();

  const meta = to.meta.auth;
  if (!meta) return;

  const session = await auth.getSession();

  if (meta.guest === "deny" && !session.data?.user) return abortNavigation();
  if (meta.user === "deny" && session.data?.user) return abortNavigation();
});
