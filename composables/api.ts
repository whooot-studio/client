export default function useApi() {
  const api = useRuntimeConfig().public.api;
  const baseUrl = `${api.host}:${api.port}/api`;

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
