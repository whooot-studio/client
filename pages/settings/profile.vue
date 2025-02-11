<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import useAuth from "~/composables/auth";
import { usernameValidator } from "~/schema/auth.schema";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

const { user, client: authClient } = useAuth();

const error = ref<string | null>(null);

const UsernameSchema = z.object({ username: usernameValidator });
type UsernameSchema = z.infer<typeof UsernameSchema>;
const input = reactive({
  username: "",
  email: "",
});
watchEffect(() => {
  input.username = user.value?.name ?? "";
  input.email = user.value?.email ?? "";
});

async function updateUsername(event: FormSubmitEvent<UsernameSchema>) {
  await authClient.updateUser({
    name: event.data.username,
  });
}

const items = [
  {
    key: "general",
    label: "General",
    icon: "tabler:settings",
  },
  {
    key: "danger-zone",
    label: "Danger Zone",
    icon: "tabler:shield-x",
  },
];

const isOpen = ref(false);
async function deleteUserStart() {
  isOpen.value = true;
}
async function deleteUser() {
  await authClient.deleteUser({
    fetchOptions: {
      onError: (ctx) => {
        error.value = ctx.error.message;
      },
      onSuccess: async (ctx) => {
        isOpen.value = false;
        await navigateTo("/", {
          external: true,
        });
      },
    },
  });
}
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-3xl' }">
    <UTabs :items="items" class="w-full">
      <template #item="{ item }">
        <UCard
          :ui="{
            strategy: 'merge',
            body: {
              padding: 'space-y-2',
            },
          }"
        >
          <template v-if="item.key === 'general'">
            <UInput
              v-model="input.email"
              :icon="
                user?.emailVerified
                  ? 'tabler:rosette-discount-check'
                  : 'tabler:rosette-discount-check-off'
              "
              :color="user?.emailVerified ? 'green' : 'red'"
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
              <ClientOnly>
                Joined:
                {{ new Date(user?.createdAt!).toLocaleDateString() }}
              </ClientOnly>
            </p>
          </template>

          <template v-else-if="item.key === 'danger-zone'">
            <UButton
              color="red"
              variant="solid"
              icon="tabler:trash-x"
              @click="deleteUserStart"
            >
              Delete my account
            </UButton>

            <UModal v-model="isOpen">
              <div class="p-4">
                <p class="text-lg font-semibold">Are you sure?</p>
                <p class="text-sm text-gray-500">
                  This action cannot be undone. This will permanently delete
                  your account and all associated data.
                </p>

                <UAlert
                  v-if="error"
                  class="mt-4"
                  icon="tabler:alert-octagon"
                  color="red"
                  variant="subtle"
                  title="Error"
                  :description="error"
                />

                <div class="flex gap-2 justify-end mt-4">
                  <UButton color="gray" @click="isOpen = false">Cancel</UButton>
                  <UButton color="red" @click="deleteUser">Delete</UButton>
                </div>
              </div>
            </UModal>
          </template>
        </UCard>
      </template>
    </UTabs>
  </UContainer>
</template>
