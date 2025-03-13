<script setup lang="ts">
import { useClipboard, useShare, type UseShareOptions } from "@vueuse/core";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import useApi from "~/composables/api";
import useClient from "~/composables/client";
import useParticles from "~/composables/particles";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

type User = {
  id: string;
  username: string;
  image?: string;
};
type Question = {
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  quizId: string;
  title: string;
  choices: string[];
  answer: string;
  points: number;
};

const toast = useToast();

const code = ref<string>("");
const roomUrl = computed(() => `${client.origin}/room/${code.value}`);

const state = ref<"idle" | "started" | "ended">("idle");
const members = ref<Map<string, User>>(new Map());
const questions = ref<Question[]>([]);
const currentQuestion = ref<Question | null>(null);
const currentQuestionHasPrevious = ref<boolean>(false);
const currentQuestionHasNext = ref<boolean>(false);

const client = useClient();
const route = useRoute();

const qr = useQRCode(() => roomUrl.value, {
  errorCorrectionLevel: "H",
  mode: "alphanumeric",
  width: 540,
  margin: 2,
});

const { copy: clipboardCopy, isSupported: clipboardSupported } = useClipboard({
  source: roomUrl,
});
function clipboardCopyWrapper() {
  if (clipboardSupported.value) {
    clipboardCopy();
    toast.add({
      title: "Link copied",
      description: "Room link copied to clipboard",
      color: "green",
      timeout: 5000,
    });
  } else
    toast.add({
      title: "Copy not supported",
      description: "Your browser does not support the Clipboard API",
      color: "red",
      timeout: 8000,
    });
}

const shareOptions = ref<UseShareOptions>({
  title: "Join my quiz on Whooot!",
  url: roomUrl.value,
});
const { share, isSupported: shareSupported } = useShare(shareOptions);
function shareWrapper() {
  if (shareSupported.value) share();
  else
    toast.add({
      title: "Share not supported",
      description:
        "Your browser does not support sharing. Please try to copy the link instead",
      color: "red",
      timeout: 8000,
    });
}

const particles = useParticles();

const { endpoints } = useApi();
const { send } = useWebSocket(endpoints.rooms, {
  onConnected: async (_socket) => {
    const payload = {
      action: "meta:setup",
      quiz: route.params.id,
    };

    send(JSON.stringify(payload));
  },

  onMessage: async (_socket, event) => {
    const blob = event.data;

    let payload;
    if (!blob || !(blob instanceof Blob)) payload = JSON.parse(event.data);
    else payload = JSON.parse(await blob.text());
    if (!payload.action) return;

    console.log(payload.action, JSON.stringify(payload));

    switch (payload.action) {
      case "meta:code":
        code.value = payload.code;
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

      case "members:join":
        members.value.set(payload.member.id, payload.member);
        break;

      case "members:leave":
        members.value.delete(payload.member.id);
        break;

      case "members:all":
        for (const member of payload.members) {
          members.value.set(member.id, member as User);
        }
        break;

      case "interact:emote":
        {
          const { emote } = payload as { emote: string };
          particles.summon(emote, 1000);
        }
        break;

      case "game:start":
        {
          state.value = "started";
        }
        break;

      case "game:end":
        {
          state.value = "ended";
        }
        break;

      case "game:quiz":
        {
          const { questions: q } = payload as { questions: Question[] };
          questions.value = q;
        }
        break;

      case "game:question":
        {
          const { question, hasNext, hasPrevious } = payload as {
            question: Question;
            hasNext: boolean;
            hasPrevious: boolean;
          };
          currentQuestion.value = question;
          currentQuestionHasNext.value = hasNext;
          currentQuestionHasPrevious.value = hasPrevious;
        }
        break;
    }
  },

  onError: (ws, error) => {
    console.error(error);
  },

  onDisconnected: () => {
    console.log("Disconnected");
  },
});

function start() {
  const payload = {
    action: "game:start",
    code: code.value,
  };
  send(JSON.stringify(payload));
}

function next() {
  const payload = {
    action: "game:next",
    code: code.value,
  };
  send(JSON.stringify(payload));
}

function previous() {
  const payload = {
    action: "game:previous",
    code: code.value,
  };
  send(JSON.stringify(payload));
}
</script>

<template>
  <UContainer :ui="{ constrained: 'flex flex-col md:flex-row gap-2' }">
    <template v-if="code && state === 'idle'">
      <section class="w-full md:w-2/3 mb-8 md:mb-0">
        <div class="mx-auto md:w-fit">
          <img
            class="border-4 border-primary-500 rounded-lg w-72 mx-auto"
            :src="qr"
            :alt="`${client.origin}/room/${code}`"
          />

          <UDivider class="my-4" label="ALTERNATIVE ACCESS" />

          <div class="p-6">
            <div class="mb-4">
              <p class="text-xl font-bold">Step 1</p>
              <p class="text-gray-700">
                Open <span class="font-mono">{{ client.origin }}/room</span> in
                your favorite browser
              </p>
            </div>
            <div>
              <p class="text-xl font-bold">Step 2</p>
              <p class="text-gray-700">
                Enter
                <span
                  class="inline-block font-mono font-bold p-2 border-2 rounded-lg border-primary-500 bg-primary-50"
                  >{{ code }}</span
                >
              </p>
            </div>
          </div>

          <template v-if="clipboardSupported || shareSupported">
            <UDivider class="my-4" label="SHARE ROOM LINK" />

            <UButtonGroup
              :ui="{
                wrapper: {
                  horizontal: 'grid grid-cols-2 justify-stretch',
                },
              }"
            >
              <UButton
                size="lg"
                @click="clipboardCopyWrapper()"
                icon="tabler:copy"
                block
              >
                Copy Link
              </UButton>
              <UButton
                size="lg"
                @click="shareWrapper()"
                icon="tabler:share"
                block
              >
                Share Link
              </UButton>
            </UButtonGroup>
          </template>
        </div>
      </section>

      <section class="w-full md:w-1/3 space-y-2">
        <UButton @click="start" :disabled="members.size <= 0" size="lg" block
          >Start</UButton
        >
        <UAvatarGroup v-if="members.size > 0" :ui="{ wrapper: 'flex-wrap' }">
          <UAvatar
            v-for="[id, member] in members"
            :key="id"
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
    </template>
    <div v-else-if="state === 'started'" class="w-full">
      <section class="w-full md:w-2/3 mb-8 md:mb-0 md:mx-auto">
        <div class="flex justify-between mb-4">
          <UButton
            icon="tabler:arrow-left"
            variant="outline"
            @click="previous"
            :disabled="!currentQuestionHasPrevious"
          >
            Previous
          </UButton>
          <UButton
            v-if="currentQuestionHasNext"
            icon="tabler:arrow-right"
            iconRight
            variant="outline"
            @click="next"
          >
            Next
          </UButton>
          <UButton
            v-else
            icon="tabler:check"
            iconRight
            variant="outline"
            @click="next"
          >
            Finish
          </UButton>
        </div>

        <div class="p-6">
          <p class="text-xl font-bold">
            {{ currentQuestion?.title }}
          </p>

          <div class="text-gray-700 p-4 border-2 border-violet-500 rounded-lg">
            <p v-for="choice in currentQuestion?.choices" :key="choice">
              {{ choice }}
            </p>
          </div>
        </div>
      </section>
    </div>
    <div v-else-if="state === 'ended'">
      <p>ended</p>
    </div>
  </UContainer>

  <InteractEmote :particles="particles.entities" />
</template>
