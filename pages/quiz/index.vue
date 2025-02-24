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

const toast = useToast();
const { endpoints } = useApi();
const list = `${endpoints.quiz}/list`;

const { data, error, status } = await useFetch<Quiz[]>(list, {
  credentials: "include",
  headers: useRequestHeaders(),
  key: "quiz-list",
});

async function deleteQuiz(quizId: string) {
  try {
    await $fetch(`${endpoints.quiz}/delete`, {
      method: "POST",
      credentials: "include",
      headers: useRequestHeaders(),
      body: {
        id: quizId,
      },
    });

    toast.add({
      title: "Quiz deleted",
      description: "Your quiz has been deleted successfully",
      icon: "tabler:check",
      timeout: 5000,
      color: "green",
    });

    data.value = data.value?.filter((quiz) => quiz.id !== quizId) || [];
  } catch (e: any) {
    toast.add({
      title: "Error",
      description: e.message || e.toString(),
      icon: "tabler:alert-circle",
      timeout: 5000,
      color: "red",
    });
    error.value = e.toString();
  }
}
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-3xl' }">
    <div class="flex justify-between items-center gap-4 mb-4">
      <h1 class="text-3xl font-bold">My quizzes</h1>

      <UButton to="/quiz/new" type="button" size="lg" icon="tabler:plus">
        Create a quiz
      </UButton>
    </div>

    <section class="space-y-2">
      <UCard v-for="quiz in data" :key="quiz.id">
        <div>
          <p class="font-semibold">{{ quiz.title }}</p>
          <p class="text-sm text-gray-600">
            <ClientOnly fallback="...">{{
              new Date(quiz.createdAt!).toLocaleDateString()
            }}</ClientOnly>
          </p>
          <p v-if="quiz.description" class="mt-2">
            {{ quiz.description }}
          </p>
        </div>

        <div class="flex gap-2 mt-4">
          <UButton
            size="lg"
            variant="solid"
            color="primary"
            :to="`/quiz/${quiz.id}/admin`"
            icon="tabler:target"
            >Play</UButton
          >
          <UButton
            size="lg"
            variant="outline"
            color="primary"
            :to="`/quiz/${quiz.id}/edit`"
            icon="tabler:edit"
            >Edit</UButton
          >
          <UButton
            size="lg"
            variant="outline"
            color="red"
            @click="deleteQuiz(quiz.id)"
            icon="tabler:trash"
            >Delete</UButton
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
