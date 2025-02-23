<script setup lang="ts">
import useApi from "~/composables/api";
import useAuth from "~/composables/auth";
import type { FormSubmitEvent } from "#ui/types";

import { QuizSchema } from "~/schema/quiz.schema";
import QuestionCard from "~/components/quiz/QuestionCard.vue";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

type ApiData = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  users:
    | {
        id: string;
        name: string;
        image: string | null;
        email: string;
      }[]
    | undefined;
  questions:
    | {
        answer: string;
        choices: string[];
        createdAt: Date;
        id: string;
        points: number;
        quizId: string;
        title: string;
        type: string;
      }[]
    | undefined;
  games:
    | {
        id: string;
        hostId: string;
        quizId: string;
        startedAt: Date | null;
        endedAt: Date | null;
      }[]
    | undefined;
};

const toast = useToast();
const { endpoints } = useApi();
const getEndpoint = `${endpoints.quiz}/get`;
const updateEndpoint = `${endpoints.quiz}/update`;

const { client: authClient } = useAuth();
const router = useRouter();
const route = useRoute();

const error = ref<any>(null);
const loading = ref(false);

const state = reactive({
  title: "" as any,
  description: "" as any,
  image: "" as any,
  questions: [] as any[],
  users: [] as any[],
});

const { data: init } = await useFetch<ApiData>(getEndpoint, {
  method: "POST",
  credentials: "include",
  headers: useRequestHeaders(),
  body: {
    id: route.params.id,
    include: ["users", "questions"],
  },
  key: "quiz-data",
});
state.title = init.value?.title;
state.description = init.value?.description;
state.image = init.value?.image;
state.questions = init.value?.questions || [];
state.users = init.value?.users || [];

async function updateQuiz(input: QuizSchema) {
  try {
    loading.value = true;
    error.value = null;

    const data = await $fetch<ApiData>(updateEndpoint, {
      method: "POST",
      credentials: "include",
      headers: useRequestHeaders(),
      body: {
        id: route.params.id,
        title: input.title,
        description: input.description,
        image: input.image,
      },
    });

    toast.add({
      title: "Quiz updated",
      description: "Your quiz has been updated successfully",
      icon: "tabler:check",
      timeout: 5000,
      color: "green",
    });

    loading.value = false;

    state.title = data.title;
    state.description = data.description || undefined;
    state.image = data.image || undefined;
  } catch (e: any) {
    loading.value = false;
    error.value = e.toString();
  }
}

async function deleteQuiz() {
  try {
    await $fetch(`${endpoints.quiz}/delete`, {
      method: "POST",
      credentials: "include",
      headers: useRequestHeaders(),
      body: {
        id: route.params.id,
      },
    });

    toast.add({
      title: "Quiz deleted",
      description: "Your quiz has been deleted successfully",
      icon: "tabler:check",
      timeout: 5000,
      color: "green",
    });

    router.push("/quiz");
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

async function submitQuiz(event: FormSubmitEvent<QuizSchema>) {
  await updateQuiz(event.data);
}

function addQuestion() {
  state.questions.push({
    id: `local-${Math.random()}`, // Random ID if not saved
  });
}
function saveQuestion(index: number, data: any) {
  state.questions[index] = data;
}
function removeQuestion(index: number) {
  state.questions.splice(index, 1);
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
      :schema="QuizSchema"
      :state="state"
      class="space-y-4"
      @submit="submitQuiz"
    >
      <UFormGroup label="Title" name="title" required>
        <UInput v-model="state.title" type="text" />
      </UFormGroup>

      <UFormGroup label="Description" name="description">
        <UTextarea v-model="state.description" autoresize />
      </UFormGroup>

      <UFormGroup label="Image" name="image">
        <UInput v-model="state.image" icon="tabler:photo" />
      </UFormGroup>

      <div class="flex gap-2">
        <UButton type="submit" size="md" :loading="loading" loading-icon="">
          Update
        </UButton>

        <UButton
          type="button"
          size="md"
          icon="tabler:trash"
          color="red"
          @click="deleteQuiz"
        >
          Delete
        </UButton>
      </div>
    </UForm>

    <UDivider class="my-12" label="QUESTIONS" />

    <section class="space-y-2 mb-4">
      <template v-for="(question, index) in state.questions" :key="question.id">
        <QuestionCard
          v-bind="question"
          @save="(data) => saveQuestion(index, data)"
          @delete="removeQuestion(index)"
        />
      </template>
    </section>

    <div class="flex gap-2">
      <UButton type="button" size="md" icon="tabler:plus" @click="addQuestion">
        Add a question
      </UButton>
    </div>
  </UContainer>
</template>
