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
      v-for="{ id, sender, message } in messages"
      :key="id"
      :text="[message]"
      :name="users.get(sender.id)?.user.name"
      :sent="sender.id === auth.currentUser?.uid"
      :avatar="
        sender.name !== auth.currentUser?.uid
          ? users.get(sender.id)?.user.photoUrl
          : undefined
      "
    />
  </q-infinite-scroll>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { graphql } from "@/gql/__generated__";
import { useQuery } from "@vue/apollo-composable";
import type { QInfiniteScrollProps } from "quasar";
import { auth } from "@/firebase";
import { watchMessages, type CourseChatMessageData } from "../api";
import type { QuerySnapshot } from "@firebase/firestore";
import type { CourseChatMembersQuery } from "@/gql/__generated__/graphql";

const props = defineProps<{
  courseId: string;
  chatId: string;
}>();

const { result } = useQuery(
  graphql(`
    query CourseChatMembers($courseId: ID!, $chatId: String!) {
      courseChat(courseId: $courseId, chatId: $chatId) {
        id
        users {
          id
          user {
            id
            photoUrl
            name
          }
        }
      }
    }
  `),
  { courseId: props.courseId, chatId: props.chatId },
  { fetchPolicy: "cache-and-network" }
);

const users = computed(() => {
  const userMap = new Map<
    string,
    CourseChatMembersQuery["courseChat"]["users"][number]
  >();
  result.value?.courseChat?.users?.forEach((u) => {
    userMap.set(u.id, u);
  });

  return userMap;
});

const messages = ref<
  {
    id: string;
    message: string;
    createdAt: number;
    sender: { id: string; name: string; photoUrl: string };
  }[]
>([]);

/**
 * Loads a new lot of chats.
 * @param snapshot The new document snapshots.
 */
const onNext = (snapshot: QuerySnapshot<CourseChatMessageData>) => {
  messages.value = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      message: d.message,
      createdAt: d.created,
      sender: {
        id: d.sender,
        isMe: auth.currentUser?.uid === d.userId,
        name: d.userId,
        photoUrl:
          "https://ui-avatars.com/api/?background=random&name=Smart%20Student",
      },
    };
  });
};

let stopWatch: (() => void) | undefined = undefined;
onMounted(() => {
  // Load the first lot of chats
  stopWatch = watchMessages(props.courseId, props.chatId, onNext, () => {});
});
onUnmounted(() => {
  // Unsubscribe from the Firestore query
  stopWatch?.();
});

/**
 * Loads more chats from Firestore.
 * @param index The number of chats calls to load already made.
 * @param done The function to call when the loading is done.
 */
const onLoad: QInfiniteScrollProps["onLoad"] = async (index, done) => {
  done();
};
</script>
