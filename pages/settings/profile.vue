<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import authClient from "~/lib/auth";
import { usernameValidator } from "~/schema/auth.schema";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

const { useSession } = authClient;
const session = useSession();

const UsernameSchema = z.object({ username: usernameValidator });
type UsernameSchema = z.infer<typeof UsernameSchema>;
const input = reactive({
  username: "",
  email: "",
});
watchEffect(() => {
  input.username = session.value.data?.user.name ?? "";
  input.email = session.value.data?.user.email ?? "";
});

async function updateUsername(event: FormSubmitEvent<UsernameSchema>) {
  await authClient.updateUser({
    name: event.data.username,
  });
}
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-3xl' }" class="space-y-2">
    <UInput
      v-model="input.email"
      :icon="
        session.data?.user.emailVerified
          ? 'tabler:rosette-discount-check'
          : 'tabler:rosette-discount-check-off'
      "
      :color="session.data?.user.emailVerified ? 'green' : 'red'"
      disabled
    />

    <UForm
      :schema="UsernameSchema"
      :state="input"
      @submit="updateUsername"
      class="flex flex-row gap-4"
    >
      <UFormGroup name="username" required class="w-full">
        <UInput
          v-model="input.username"
          autocomplete="username"
          icon="tabler:user"
        />
      </UFormGroup>
      <UButton type="submit">Update</UButton>
    </UForm>

    <p class="text-sm text-gray-500">
      Joined: {{ new Date(session.data?.user.createdAt!).toLocaleDateString() }}
    </p>
  </UContainer>
</template>
