<script setup lang="ts">
import { useQRCode } from "@vueuse/integrations/useQRCode";
import useApi from "~/composables/api";
import useClient from "~/composables/client";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

const client = useClient();

type User = {
  id: string;
  name: string;
};

const route = useRoute();
const code = ref<string>("");
const members = ref<Map<string, User>>(new Map());
// TODO: Use the actual client URL
const qr = useQRCode(() => `${client.origin}/rooms/${code.value}`, {
  errorCorrectionLevel: "H",
  mode: "alphanumeric",
});

const { endpoints } = useApi();
const { send } = useWebSocket(endpoints.rooms, {
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
        members.value.set(payload.member.id, payload.member);
        break;

      case "members:leave":
        members.value.delete(payload.member.id);
        break;

      case "members:all":
        for (const [id, member] of Object.entries(payload.members)) {
          members.value.set(id, member as User);
        }
        break;
    }
  },

  onError: (ws, error) => {
    console.error(error);
  },

  onDisconnected: () => {
    console.log("Disconnected");
  },
});

const start = () => {
  const payload = {
    action: "game:start",
    code: code.value,
  };

  send(JSON.stringify(payload));
};
</script>

<template>
  <template v-if="code">
    <p>Code: {{ code }}</p>
    <img class="w-72" :src="qr" />
  </template>

  <p v-if="members" v-for="[id, member] in members" :key="id">
    {{ member.name }}
  </p>

  <button @click="start">Start</button>
</template>
