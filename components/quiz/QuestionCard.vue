<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import useApi from "~/composables/api";
import { QuestionSchema } from "~/schema/question.schema";

const props = defineProps<
  Partial<{
    answer: string;
    choices: string[];
    points: number;
    quizId: string;
    title: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  }> & {
    id: string;
  }
>();

type Question = {
  answer: string;
  choices: string[];
  createdAt: Date;
  id: string;
  points: number;
  quizId: string;
  title: string;
  type: string;
};

const emit = defineEmits<{
  save: [Question];
  delete: [];
}>();

const toast = useToast();

const questionTypes = [
  {
    id: "SNG",
    label: "Single Choice",
  },
  {
    id: "MUL",
    label: "Multiple Choice",
  },
  {
    id: "BOL",
    label: "Yes or No",
  },
];

const state = reactive({
  title: props.title || undefined,
  type: props.type || "SNG",
  points: props.points || 0,
  choices: props.choices || ([""] as string[]),
  answer: undefined as string | string[] | undefined,
});
try {
  const parsed = JSON.parse(props.answer!);
  if (Array.isArray(parsed)) state.answer = parsed as string[];
  else state.answer = props.answer || undefined;
} catch {
  state.answer = props.answer || undefined;
}

watch(
  () => state.type,
  (type) => {
    state.answer = undefined;
    if (type === "BOL") {
      state.choices = ["Yes", "No"];
    } else {
      state.choices = [""];
    }
  }
);

const route = useRoute();
const { endpoints } = useApi();
const updateEndpoint = `${endpoints.question}/update`;
const deleteEndpoint = `${endpoints.question}/delete`;

async function submitQuestion(event: FormSubmitEvent<QuestionSchema>) {
  const data = event.data;

  try {
    const res = await $fetch<Question>(updateEndpoint, {
      method: "POST",
      credentials: "include",
      headers: useRequestHeaders(),
      body: {
        id: props.id.startsWith("local-") ? undefined : props.id,
        quizId: route.params.id,
        title: data.title,
        type: data.type,
        choices: data.choices,
        answer: data.answer,
        points: data.points,
      },
    });

    try {
      state.answer = JSON.parse(res.answer);
    } catch {
      state.answer = props.answer;
    }

    emit("save", res);
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "An error occurred",
      color: "red",
      timeout: 10000,
    });
  }
}

async function deleteQuestion() {
  try {
    if (props.id.startsWith("local-")) return emit("delete");

    await $fetch<void>(deleteEndpoint, {
      method: "POST",
      credentials: "include",
      headers: useRequestHeaders(),
      body: {
        id: props.id,
        quizId: route.params.id,
      },
    });

    emit("delete");
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "An error occurred",
      color: "red",
      timeout: 10000,
    });
  }
}
</script>

<template>
  <UCard>
    <UForm
      :schema="QuestionSchema"
      :state="state"
      class="space-y-4"
      @submit="submitQuestion"
    >
      <UFormGroup label="Type" name="type" required>
        <USelectMenu
          v-model="state.type"
          :options="questionTypes"
          value-attribute="id"
        />
      </UFormGroup>

      <UFormGroup label="Question" name="title" required>
        <UInput v-model="state.title" type="text" />
      </UFormGroup>

      <UDivider />

      <template v-if="state.type === 'SNG' || state.type === 'MUL'">
        <div class="space-y-2">
          <div class="grid grid-flow-row grid-cols-2 gap-4">
            <UFormGroup
              v-for="(choice, index) in state.choices"
              :key="index"
              :name="`choices.${index}`"
              required
            >
              <UInput v-model="state.choices[index]" />
            </UFormGroup>
            <UButtonGroup class="w-full">
              <UButton
                @click="state.choices.push('')"
                icon="tabler:plus"
                variant="soft"
                block
                class="w-1/2"
                >Add option</UButton
              >
              <UButton
                @click="state.choices.pop()"
                icon="tabler:minus"
                variant="soft"
                block
                class="w-1/2"
                >Remove option</UButton
              >
            </UButtonGroup>
          </div>
        </div>
        <UDivider />
      </template>

      <UFormGroup label="Answer" name="answer" required>
        <USelectMenu
          v-model="state.answer"
          :options="state.choices.filter(Boolean)"
          :multiple="state.type === 'MUL'"
        />
      </UFormGroup>

      <UFormGroup label="Points" name="points">
        <UInput v-model.number="state.points" type="number" />
      </UFormGroup>

      <div class="space-y-1">
        <div class="flex gap-2">
          <UButton type="submit" size="md" icon="tabler:checks">Save</UButton>
          <UButton
            size="md"
            color="red"
            icon="tabler:trash"
            @click="deleteQuestion"
            >Delete</UButton
          >
        </div>
        <p v-if="id.startsWith('local-')" class="text-sm text-gray-700">
          This question is not saved!
        </p>
      </div>
    </UForm>
  </UCard>
</template>
