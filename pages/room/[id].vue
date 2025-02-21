<script setup lang="ts">
import useApi from "~/composables/api";

type User = {
  id: string;
  name: string;
};

const route = useRoute();
const members = ref<Map<string, User>>(new Map());

const game = ref<{
  state: "idle" | "started" | "ended";
  question?: string;
  options?: string[];
}>({
  state: "idle",
});

const { endpoints } = useApi();
const { send } = useWebSocket(endpoints.rooms, {
  onConnected: async (ws) => {
    if (!route.params.id) return;

    console.log("Joining room", route.params.id);
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

      case "game:start":
        game.value.state = "started";
        break;

      case "game:question:start":
        game.value.question = payload.question;
        game.value.options = payload.options;
        break;

      case "game:question:end":
        game.value.question = undefined;
        game.value.options = undefined;
        break;
    }
  },
});
</script>

<template>
  <p v-if="members" v-for="[id, member] in members" :key="id">
    {{ member.name }}
  </p>

  <template v-if="game.state === 'started'">
    <p>{{ game.question }}</p>
    <p v-for="option in game.options" :key="option">
      {{ option }}
    </p>
  </template>
</template>
