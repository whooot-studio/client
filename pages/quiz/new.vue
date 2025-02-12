<script setup lang="ts">
import { defu } from "defu";
import useApi from "~/composables/api";
import useAuth from "~/composables/auth";
import type { FormSubmitEvent } from "#ui/types";

import { QuizCreateSchema } from "~/schema/quiz.schema";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

const { endpoints } = useApi();
const createEndpoint = `${endpoints.quiz}/create`;

const { client: authClient } = useAuth();
const router = useRouter();

const error = ref<any>(null);
async function create(input: QuizCreateSchema) {
  try {
    await $fetch(createEndpoint, {
      method: "POST",
      credentials: "include",
      headers: useRequestHeaders(),
      body: {
        title: input.title,
        description: input.description,
        image: input.image,
      },
    });
    router.push("/quiz");
  } catch (e: any) {
    error.value = e.toString();
  }
}

const state = reactive({
  title: undefined,
  description: undefined,
  image: undefined,
});

async function onSubmit(event: FormSubmitEvent<QuizCreateSchema>) {
  await create(event.data);
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
      :schema="QuizCreateSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup label="Title" name="title" required>
        <UInput v-model="state.title" type="text" />
      </UFormGroup>

      <UFormGroup label="Description" name="description">
        <UInput
          v-model="state.description"
          type="textarea"
          icon="tabler:file-description"
        />
      </UFormGroup>

      <UFormGroup label="Image" name="image">
        <UInput v-model="state.image" icon="tabler:photo" />
      </UFormGroup>

      <div>
        <UButton type="submit">Create</UButton>
      </div>
    </UForm>
  </UContainer>
</template>
