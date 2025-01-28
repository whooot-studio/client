<script setup lang="ts">
import { useQRCode } from "@vueuse/integrations/useQRCode";

const route = useRoute();
const code = ref<string>("");
const members = ref<any[]>([]);

// TODO: Use the actual client URL
const qr = useQRCode(() => `http://localhost:3000/rooms/${code.value}`, {
  errorCorrectionLevel: "H",
  mode: "alphanumeric",
});

const { send } = useWebSocket(ENDPOINTS.rooms, {
  onConnected: async (_socket) => {
    const payload = {
      action: "meta:setup",
      quiz: route.params.id,
    };

    send(JSON.stringify(payload));
  },

  onMessage: async (_socket, event) => {
    const blob = event.data;
    if (!blob || !(blob instanceof Blob)) return;

    const payload = JSON.parse(await blob.text());
    if (!payload.action) return;

    console.log(payload.action, JSON.stringify(payload));

    switch (payload.action) {
      case "meta:code":
        code.value = payload.code;
        break;

      case "members:join":
        members.value.push(payload.member);
        break;

      case "members:leave":
        members.value = members.value.filter((m) => m === payload.member);
        break;

      case "members:all":
        members.value = payload.members;
        break;
    }
  },
});
</script>

<template>
  <template v-if="code">
    <p>Code: {{ code }}</p>
    <img class="w-72" :src="qr" />
  </template>
</template>
