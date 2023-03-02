<template>
  <q-card
    flat
    bordered
    class="flex column no-wrap q-my-md"
    style="
      position: sticky;
      top: 1rem;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
    "
  >
    <q-card-section class="row no-wrap items-center q-pa-sm">
      <q-btn
        v-if="$q.screen.lt.md"
        no-caps
        outline
        color="primary"
        icon="mdi-chevron-left"
        label="Back"
        class="q-ml-xl q-mr-md"
        style="flex-shrink: 0"
        :to="{ name: 'AppCourseChats' }"
      />

      <div
        class="row no-wrap full-width"
        style="
          justify-content: space-between;
          flex-grow: 1;
          flex-shrink: 1;
          overflow: hidden;
        "
      >
        <div class="text-h6 ellipsis col-shrink">{{ chat?.name }}</div>

        <q-btn
          flat
          round
          dense
          color="primary"
          icon="mdi-cog"
          @click="showChatMembersDialog = true"
        />

        <CustomDialog v-model="showChatMembersDialog" title="Chat Settings">
          <AppCourseChatStudentsDialog
            v-if="chat"
            :users="chat?.users"
            :name="chat?.name"
            :course-id="(courseId as string)"
            :chat-id="(chatId as string)"
            :personal="chat?.personal"
            @update="refetch"
          />
        </CustomDialog>
      </div>
    </q-card-section>

    <q-separator />
    <AppCourseChatMessages :course-id="courseId" :chat-id="chatId" />
    <q-separator />
    <AppCourseChatInput :course-id="courseId" :chat-id="chatId" />
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { graphql } from "@/gql/__generated__";
import { useQuery } from "@vue/apollo-composable";
import AppCourseChatInput from "./AppCourseChatInput.vue";
import AppCourseChatMessages from "./AppCourseChatMessages.vue";
import CustomDialog from "@/components/CustomDialog.vue";
import AppCourseChatStudentsDialog from "./AppCourseChatStudentsDialog.vue";

const showChatMembersDialog = ref(false);

const {
  params: { courseId, chatId },
} = useRoute() as unknown as { params: { courseId: string; chatId: string } };

// Ensure the chat exists
// TODO: Show a 404 page if the chat doesn't exist
const { result, refetch } = useQuery(
  graphql(`
    query getCourseChat($courseId: ID!, $chatId: String!) {
      courseChat(courseId: $courseId, chatId: $chatId) {
        id
        personal
        name
        users {
          id
          groupId
          user {
            id
            photoUrl
            name
          }
        }
      }
    }
  `),
  { courseId: courseId, chatId: chatId },
  { fetchPolicy: "cache-and-network" }
);

const chat = computed(() => result.value?.courseChat);
</script>
