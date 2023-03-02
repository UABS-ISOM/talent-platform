<template>
  <div v-if="addLoading" class="q-pa-sm flex items-center justify-center">
    <q-spinner-dots color="primary" size="xl" aria-label="Loading" />
  </div>

  <div v-else-if="chats !== undefined" class="q-pa-sm">
    <GenericAlert
      :model-value="addError !== null"
      static
      type="error"
      class="full-width q-mb-md"
    >
      {{ getErrorMessage(addError) }}
    </GenericAlert>

    <q-list separator style="margin: -8px -16px">
      <template v-if="chats.length > 0">
        <q-item-label header>Group Chats</q-item-label>

        <q-item
          v-for="{ id, name: chatName, inChat } in chats"
          :key="id"
          v-ripple="!inChat"
          clickable
          :disable="inChat"
          @click="addStudentToChat(id, chatName)"
        >
          <q-item-section avatar>
            <q-avatar icon="mdi-account-group" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              {{ chatName }}
            </q-item-label>
            <q-item-label v-if="inChat" caption lines="1">
              {{ name }} is already in this chat
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <GenericNone v-else class="q-mx-md q-my-sm">
        You're not in any group chats yet. Create one in the chat tab.
      </GenericNone>
    </q-list>
  </div>

  <div v-else-if="loading || error" class="q-pa-sm">
    <template v-if="loading">
      <div style="margin: -8px -16px">
        <q-list separator>
          <q-item-label header>Group Chats</q-item-label>

          <q-item v-for="i in 3" :key="i">
            <q-item-section avatar>
              <q-skeleton type="QAvatar" size="40px" animation="fade" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" animation="fade" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </template>

    <GenericAlert
      :model-value="error !== null"
      static
      type="error"
      class="full-width"
    >
      {{ getErrorMessage(error) }}
    </GenericAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { graphql } from "@/gql/__generated__";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { getErrorMessage } from "@/helpers";
import GenericNone from "@/components/GenericNone.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const props = defineProps<{
  name: string;
  courseId: string;
  userId: string;
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const { result, loading, error } = useQuery(
  graphql(`
    query CourseGroupChats($courseId: ID!) {
      course(courseId: $courseId) {
        groupChats {
          id
          name
          users {
            id
          }
        }
      }
    }
  `),
  { courseId: props.courseId },
  { fetchPolicy: "cache-and-network" }
);

const chats = computed(() =>
  result.value?.course?.groupChats.map((c) => ({
    ...c,
    inChat: c.users.some((u) => u.id === props.userId),
  }))
);

// Ensure the chat exists
const {
  mutate,
  loading: addLoading,
  onDone,
  error: addError,
} = useMutation(
  graphql(`
    mutation AddCourseChatMember(
      $courseId: ID!
      $uid: String!
      $chatId: String
    ) {
      addCourseChatMember(courseId: $courseId, uid: $uid, chatId: $chatId) {
        id
      }
    }
  `)
);

const addingChatName = ref("");
const addStudentToChat = (chatId: string, chatName: string) => {
  addingChatName.value = chatName;
  mutate({ courseId: props.courseId, uid: props.userId, chatId });
};

onDone(() => {
  $q.notify({
    message: `Successfully added ${props.name} to ${addingChatName.value}.`,
    progress: true,
    type: "positive",
    icon: "mdi-check",
  });
  emits("close");
});
</script>
