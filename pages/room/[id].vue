<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import PlayerAvatar from "~/components/quiz/PlayerAvatar.vue";
import useApi from "~/composables/api";
import { UsernameSchema } from "~/schema/game.schema";

type User = {
  id: string;
  name: string;
};

const route = useRoute();
const toast = useToast();

const game = reactive<{
  state: "idle" | "started" | "ended";
  members: Map<string, User>;
}>({
  state: "idle",
  members: new Map(),
});

const usernameState = reactive({
  username: "Anonymous",
});

const { endpoints } = useApi();
const { send } = useWebSocket(endpoints.rooms, {
  onMessage: async (socket, event) => {
    const blob: Blob = event.data;
    if (!blob) return;

    const payload = JSON.parse(await blob.text());
    if (!payload.action) return;

    console.log(payload.action, JSON.stringify(payload));

    switch (payload.action) {
      case "members:join":
        game.members.set(payload.member.id, payload.member);
        break;

      case "members:leave":
        game.members.delete(payload.member.id);
        break;

      case "members:all":
        for (const [id, member] of Object.entries(payload.members)) {
          game.members.set(id, member as User);
        }
        break;

      case "game:start":
        game.state = "started";
        break;

      case "meta:error":
        {
          const { code, message } = payload;
          toast.add({
            title: code || "Error",
            description: message || "An error occured",
            icon: "tabler:alert-circle",
            timeout: 8000,
            color: "red",
          });
        }
        break;

      // case "game:question:start":
      //   game.question = payload.question;
      //   game.options = payload.options;
      //   break;

      // case "game:question:end":
      //   game.question = undefined;
      //   game.options = undefined;
      //   break;
    }
  },
});

function defineUsername(event: FormSubmitEvent<UsernameSchema>) {
  return send(
    JSON.stringify({
      action: "meta:join",
      code: route.params.id,
      name: event.data.username,
    })
  );
}
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-3xl' }">
    <section v-if="game.state === 'idle'" class="space-y-4">
      <UForm
        :state="usernameState"
        :schema="UsernameSchema"
        @submit="defineUsername"
        class="max-w-md mx-auto space-y-2"
      >
        <UFormGroup name="username" label="Username" required>
          <UInput
            type="string"
            icon="tabler:user"
            v-model="usernameState.username"
          />
        </UFormGroup>

        <UButton type="submit" block>
          Join
          <template v-if="usernameState.username">
            as
            <span class="underline underline-offset-4">{{
              usernameState.username
            }}</span>
          </template>
        </UButton>
      </UForm>

      <UDivider />

      <UAvatarGroup
        v-if="game.members.size > 0"
        :ui="{ wrapper: 'flex-row justify-start flex-wrap' }"
      >
        <PlayerAvatar
          v-for="[id, member] in game.members"
          :key="id"
          :player="member"
        />
      </UAvatarGroup>
      <template v-else>
        <p class="text-sm italic text-gray-700">
          Waiting for players to join...
        </p>

        <UAvatarGroup class="animate-pulse">
          <PlayerAvatar />
          <PlayerAvatar />
          <PlayerAvatar />
        </UAvatarGroup>
      </template>
    </section>
  </UContainer>
</template>
