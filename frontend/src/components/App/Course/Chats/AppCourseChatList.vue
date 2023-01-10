<template>
  <div
    class="q-py-sm"
    :style="{
      'flex-grow': $q.screen.lt.md ? 1 : undefined,
      width: $q.screen.gt.sm ? '360px' : undefined,
    }"
  >
    <div
      :class="`q-mx-sm q-py-sm q-pl-${$q.screen.lt.md ? 'xl' : 'sm'} q-pr-sm`"
    >
      <h2 class="text-h4 q-my-none">Chats</h2>
    </div>

    <q-list v-if="chats.length > 0" class="q-py-sm">
      <AppCourseChatListItem
        v-for="({ id, members, lastMessage }, chatIndex) in chats"
        :id="id"
        :key="id"
        :members="members"
        :last-message="lastMessage"
        :time-string="formattedTimes[chatIndex]"
      />
    </q-list>

    <p v-else class="q-px-md q-py-sm">
      <GenericNone>
        You don't have any chats yet. Start a conversation from the "Find
        Students" page.
      </GenericNone>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { formatTimeDiff } from "@/helpers";
import AppCourseChatListItem from "./AppCourseChatListItem.vue";
import GenericNone from "@/components/GenericNone.vue";
import { watchChats, type CourseChatData } from "./api";
import { auth } from "@/firebase";
import type { QuerySnapshot } from "@firebase/firestore";

const props = defineProps<{
  courseId: string;
}>();

const chats = ref<CourseChatData[]>([]);

/**
 * Loads a new lot of chats.
 * @param snapshot The new document snapshots.
 */
const onNext = (snapshot: QuerySnapshot<CourseChatData>) => {
  chats.value.push(...snapshot.docs.map((doc) => doc.data()));
};

watchChats(props.courseId, auth.currentUser?.uid ?? "", onNext, () => {});

// Update current time every minute
const timeInterval = ref<number | undefined>();
const currentTime = ref(new Date().getTime());

onMounted(() => {
  timeInterval.value = setInterval(() => {
    currentTime.value = new Date().getTime();
  }, 60000); // Recalculate every minute
});

onBeforeUnmount(() => clearInterval(timeInterval.value));

const formattedTimes = computed(() =>
  chats.value.map((chat) =>
    formatTimeDiff(currentTime.value - chat.lastMessage.created)
  )
);
</script>
