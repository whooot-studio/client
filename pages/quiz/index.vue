<script setup lang="ts">
import useApi from "~/composables/api";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

type Quiz = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  users: {
    id: string;
    name: string;
    image: string | null;
  }[];
};

const { endpoints } = useApi();
const list = `${endpoints.quiz}/list`;

const { data, error, status } = await useFetch<Quiz[]>(list, {
  credentials: "include",
  headers: useRequestHeaders(),
});
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-3xl' }">
    <div class="flex justify-between items-center gap-4 mb-4">
      <h1 class="text-3xl font-bold">My quizzes</h1>

      <UButton
        to="/quiz/new"
        type="button"
        size="lg"
        icon="tabler:plus"
        class=""
      >
        Create a quiz
      </UButton>
    </div>

    <section class="space-y-2">
      <UCard v-for="quiz in data" :key="quiz.id">
        <div>
          <p class="font-semibold">{{ quiz.title }}</p>
          <p class="text-sm text-gray-600">
            <ClientOnly>{{
              new Date(quiz.createdAt!).toLocaleDateString()
            }}</ClientOnly>
          </p>
          <p v-if="quiz.description" class="mt-2">
            {{ quiz.description }}
          </p>
        </div>

        <div class="flex gap-2 mt-4">
          <UButton
            variant="solid"
            color="primary"
            :to="`/quiz/${quiz.id}/admin`"
            >Play</UButton
          >
          <UButton
            variant="outline"
            color="primary"
            :to="`/quiz/${quiz.id}/edit`"
            >Edit</UButton
          >
        </div>

        <template #footer>
          <UAvatarGroup :max="5">
            <UAvatar
              v-for="user in quiz.users"
              :key="user.id"
              :src="user.image || undefined"
              :alt="user.name"
            />
          </UAvatarGroup>
        </template>
      </UCard>
    </section>
  </UContainer>
</template>
