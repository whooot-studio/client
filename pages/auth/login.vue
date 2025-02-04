<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import SocialLogin from "~/components/parts/SocialLogin.vue";
import useAuth from "~/composables/auth";
import { LoginSchema } from "~/schema/auth.schema";

definePageMeta({
  auth: {
    guest: "allow",
    user: "deny",
  },
});

const authClient = useAuth();
const router = useRouter();

const error = ref<any>(null);
async function connect(input: LoginSchema) {
  await authClient.signIn.email(
    {
      email: input.email,
      password: input.password,
      rememberMe: input.rememberMe,
    },
    {
      onError: (ctx) => {
        error.value = ctx.error.message;
      },
      onSuccess: (ctx) => {
        router.push("/settings/profile");
      },
    }
  );
}

const state = reactive({
  email: undefined,
  password: undefined,
  rememberMe: true,
});

async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
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
      :schema="LoginSchema"
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
          autocomplete="current-password"
          icon="tabler:key"
        />
      </UFormGroup>

      <UFormGroup name="rememberMe">
        <UCheckbox
          icon="tabler:key"
          label="Remember me"
          v-model="state.rememberMe"
          >Remember me</UCheckbox
        >
      </UFormGroup>

      <div class="flex space-x-2">
        <UButton type="submit">Login</UButton>
        <UButton
          label="I don't have an account"
          color="gray"
          to="/auth/register"
        ></UButton>
      </div>
    </UForm>

    <UDivider label="OR LOGIN WITH" class="my-4" />

    <div class="flex gap-2 justify-center">
      <SocialLogin />
    </div>
  </UContainer>
</template>
