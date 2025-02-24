<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import useApi from "~/composables/api";
import { UsernameSchema } from "~/schema/game.schema";

type User = {
  id: string;
  username: string;
  image?: string;
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

const userState = reactive({
  username: "Anonymous",
  image: undefined as string | undefined,
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
        for (const member of payload.members) {
          game.members.set(member.id, member as User);
        }
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
    }
  },
});

function defineUsername(event: FormSubmitEvent<UsernameSchema>) {
  return send(
    JSON.stringify({
      action: "meta:join",
      code: route.params.id,
      username: event.data.username,
      image: userState.image,
    })
  );
}
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-3xl' }">
    <section v-if="game.state === 'idle'" class="space-y-4">
      <UForm
        :state="userState"
        :schema="UsernameSchema"
        @submit="defineUsername"
        class="max-w-md mx-auto space-y-2"
      >
        <UFormGroup name="username" label="Username" required>
          <UInput
            type="string"
            icon="tabler:user"
            v-model="userState.username"
          />
        </UFormGroup>

        <UButton type="submit" block>
          Join
          <template v-if="userState.username">
            as
            <span class="underline underline-offset-4">{{
              userState.username
            }}</span>
          </template>
        </UButton>
      </UForm>

      <UDivider />

      <UAvatarGroup v-if="game.members.size > 0" :ui="{ wrapper: 'flex-wrap' }">
        <UAvatar
          v-for="member in game.members.values()"
          :key="member.id"
          size="xl"
          :src="member.image"
          :alt="member.username"
        />
      </UAvatarGroup>
      <template v-else>
        <p class="text-sm italic text-gray-700">
          Waiting for players to join...
        </p>

        <UAvatarGroup class="animate-pulse">
          <UAvatar size="xl" alt="user" icon="tabler:user" />
          <UAvatar size="xl" alt="user" icon="tabler:user" />
          <UAvatar size="xl" alt="user" icon="tabler:user" />
        </UAvatarGroup>
      </template>
    </section>
  </UContainer>
</template>
