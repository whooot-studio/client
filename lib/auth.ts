import { createAuthClient } from "better-auth/vue";
import useApi from "~/composables/api";

const api = useApi().endpoints;
const client = createAuthClient({
  baseURL: api.auth,
});
type client = typeof client;

export default client;