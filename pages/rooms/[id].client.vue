<script setup lang="ts">
const route = useRoute();
const members = ref<any[]>([]);

const { send } = useWebSocket(ENDPOINTS.quiz, {
  onConnected: async (ws) => {
    console.log(ws.readyState === ws.OPEN);

    if (!route.params.id) return;

    ws.send(
      JSON.stringify({
        action: "meta:join",
        code: route.params.id,
      })
    );
  },

  onMessage: async (socket, event) => {
    const blob: Blob = event.data;
    if (!blob) return;

    const payload = JSON.parse(await blob.text());
    if (!payload.action) return;

    console.log(payload.action, JSON.stringify(payload));

    switch (payload.action) {
      case "members:join":
        members.value.push(payload.member);
        break;

      case "members:leave":
        members.value = members.value.filter((m) => m !== payload.member);
        break;

      case "members:all":
        members.value = payload.members;
        break;
    }
  },
});
</script>

<template>
  <p v-for="member in members" :key="member">{{ member }}</p>
</template>
