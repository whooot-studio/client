<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import SocialLogin from "~/components/parts/SocialLogin.vue";
import useAuth from "~/composables/auth";

import { RegisterSchema } from "~/schema/auth.schema";

definePageMeta({
  auth: {
    guest: "allow",
    user: "deny",
  },
});

const { client: authClient } = useAuth();
const router = useRouter();

const error = ref<any>(null);
async function connect(input: RegisterSchema) {
  await authClient.signUp.email(
    {
      email: input.email,
      password: input.password,
      name: input.username,
    },
    {
      onError: (ctx) => {
        error.value = ctx.error.message;
      },
      onSuccess: (ctx) => {
        router.push("/auth/login");
      },
    }
  );
}

const state = reactive({
  email: undefined,
  password: undefined,
  username: undefined,
});

async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  await connect(event.data);
}
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-3xl' }">
    <UAlert
      v-if="error"
      icon="tabler:alert-octagon"
      color="red"
      variant="subtle"
      title="Error"
      :description="error"
      class="mb-4"
    />

    <UForm
      :schema="RegisterSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup label="Email" name="email" required>
        <UInput v-model="state.email" autocomplete="email" icon="tabler:mail" />
      </UFormGroup>

      <UFormGroup label="Password" name="password" required>
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="new-password"
          icon="tabler:key"
        />
      </UFormGroup>

      <UFormGroup label="Username" name="username" required>
        <UInput
          v-model="state.username"
          autocomplete="username"
          icon="tabler:user"
        />
      </UFormGroup>

      <div class="flex space-x-2">
        <UButton type="submit">Register</UButton>
        <UButton
          label="I already have an account"
          color="gray"
          to="/auth/login"
        ></UButton>
      </div>
    </UForm>

    <UDivider label="OR REGISTER WITH" class="my-4" />

    <div class="flex gap-2 justify-center">
      <SocialLogin />
    </div>
  </UContainer>
</template>
