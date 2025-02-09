/**
 * Based on https://github.com/atinux/nuxthub-better-auth/
 */

import type {
  ClientOptions,
  InferSessionFromClient,
  InferUserFromClient,
} from "better-auth/client";
import {
  genericOAuthClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";
import useApi from "~/composables/api";

export default function useAuth() {
  const api = useApi().endpoints;

  const headers = import.meta.server ? useRequestHeaders() : undefined;

  const client = createAuthClient({
    baseURL: api.auth,
    plugins: [genericOAuthClient(), organizationClient()],
    fetchOptions: {
      headers,
    },
  });

  const session = useState<InferSessionFromClient<ClientOptions> | null>(
    "auth:session",
    () => null
  );
  const user = useState<InferUserFromClient<ClientOptions> | null>(
    "auth:user",
    () => null
  );
  const sessionFetching = import.meta.server
    ? ref(false)
    : useState("auth:sessionFetching", () => false);

  const fetchSession = async () => {
    if (sessionFetching.value) return;

    sessionFetching.value = true;
    const { data } = await client.getSession({
      fetchOptions: {
        headers,
      },
    });
    session.value = data?.session || null;
    user.value = data?.user || null;
    sessionFetching.value = false;
    return data;
  };

  if (import.meta.client) {
    client.$store.listen("$sessionSignal", async (signal) => {
      if (!signal) return;
      await fetchSession();
    });
  }

  return {
    session,
    user,
    loggedIn: computed(() => !!session.value),
    fetchSession,
    client,
  };
}
