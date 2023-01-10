<template>
  <q-infinite-scroll
    class="column reverse no-wrap q-pa-md"
    style="flex-grow: 1; overflow: auto"
    @load="onLoad"
  >
    <template #loading>
      <q-spinner-dots
        color="primary"
        size="xl"
        aria-label="Loading"
        class="block q-mx-auto q-my-sm"
      />
    </template>

    <q-chat-message
      v-for="{ id, sender, message } in chats"
      :key="id"
      :text="[message]"
      :name="sender.name"
      :sent="sender.id === auth.currentUser?.uid"
      :avatar="
        sender.name !== auth.currentUser?.uid ? sender.photoUrl : undefined
      "
    />
  </q-infinite-scroll>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { graphql } from "@/gql/__generated__";
import { useQuery } from "@vue/apollo-composable";
import type { QInfiniteScrollProps } from "quasar";
import { computed } from "vue";
import { auth } from "@/firebase";
import { watchMessages, type CourseChatMessageData } from "../api";
import type { QuerySnapshot } from "@firebase/firestore";

const props = defineProps<{
  courseId: string;
  chatId: string;
}>();

const messages = ref<
  {
    id: string;
    message: string;
    createdAt: number;
    sender: { id: string; name: string; photoUrl: string };
  }[]
>([]);

// Get previous chats
const { result, onResult } = useQuery(
  graphql(`
    query getChatHistory($courseId: ID!, $chatId: String!, $afterDoc: String) {
      chatHistory(courseId: $courseId, chatId: $chatId, afterDoc: $afterDoc) {
        id
        sender {
          id
          name
          photoUrl
        }
        message
        createdAt
      }
    }
  `),
  { courseId: props.courseId, chatId: props.chatId, afterDoc: null },
  { fetchPolicy: "cache-first" }
);

watch(result, () => {
  messages.value.push(
    ...(result.value?.chatHistory ?? []).map((chat) => ({
      ...chat,
      createdAt: parseInt(chat.createdAt),
    }))
  );
});

const chats = computed(() => {
  if (result.value) {
    return result.value.chatHistory;
  }
  return [];
});

/**
 * Loads a new lot of chats.
 * @param snapshot The new document snapshots.
 */
const onNext = (snapshot: QuerySnapshot<CourseChatMessageData>) => {
  messages.value.push(
    ...snapshot.docs.map((doc) => ({
      id: doc.id,
      message: doc.data().message,
      createdAt: doc.data().created,
      sender: {
        id: doc.data().userId,
        name: "",
        photoUrl: "",
      },
    }))
  );
};

watchMessages(props.courseId, props.chatId, onNext, () => {});

// Clear the loading state when the query is done
let clearLoading: (() => void) | undefined;
onResult(() => {
  if (clearLoading !== undefined) clearLoading();
});

/**
 * Loads more chats from Firestore.
 * @param index The number of chats calls to load already made.
 * @param done The function to call when the loading is done.
 */
const onLoad: QInfiniteScrollProps["onLoad"] = async (index, done) => {
  done();
  if (index === 1) return done();

  // Wait for the GraphQL query to finish
  // console.log("Fired", index);
  await new Promise<void>((res) => (clearLoading = res));
  // console.log("Done", index);
  done();
};
</script>
