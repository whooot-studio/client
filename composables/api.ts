export default function useApi() {
  const api = useRuntimeConfig().public.api;
  const host = import.meta.server ? api.ssrHost : api.host;
  const baseUrl = `${host}${api.port ? ":" + api.port : ""}/api`;

  function createHttpEndpoint(path: string) {
    return `${api.secure ? "https" : "http"}://${baseUrl}${path}`;
  }

  function createWsEndpoint(path: string) {
    return `${api.secure ? "wss" : "ws"}://${baseUrl}${path}`;
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
