export default function useClient() {
    const client = useRuntimeConfig().public.client;
    return {
        origin: client.url,
    }
}