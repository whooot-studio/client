export default function useApi() {
  const api = useRuntimeConfig().public.api;

  const host = import.meta.server ? api.ssrHost : api.host;
  const port = import.meta.server ? api.ssrPort : api.port;
  const secure = import.meta.server ? api.ssrSecure : api.secure;

  const baseUrl = `${host}${port ? ":" + port : ""}/api`;

  function createHttpEndpoint(path: string) {
    return `${secure ? "https" : "http"}://${baseUrl}${path}`;
  }

  function createWsEndpoint(path: string) {
    return `${secure ? "wss" : "ws"}://${baseUrl}${path}`;
  }

  const endpoints = {
    auth: createHttpEndpoint("/auth"),
    quiz: createHttpEndpoint("/quiz"),
    rooms: createWsEndpoint("/rooms"),
  };

  return {
    endpoints,
  };
}
