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

    <q-list class="q-py-sm">
      <AppCourseChatListItem
        v-for="({ id, members, lastMessage }, chatIndex) in chats"
        :id="id"
        :key="id"
        :members="members"
        :last-message="lastMessage"
        :time-string="formattedTimes[chatIndex]"
      />
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { formatTimeDiff } from "@/helpers";
import AppCourseChatListItem from "./AppCourseChatListItem.vue";

const chats = ref([
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
  {
    id: "OUYOR84HWUPR8H7G",
    members: [
      { name: "Karen" },
      { name: "Mark" },
      { name: "Henry" },
      { name: "Andrew" },
      { name: "Matthew" },
    ],
    lastMessage: {
      sender: "Andrew",
      message: "Lorem ipsum dolor sit amet paparti am inim.",
      created: new Date().getTime(),
    },
  },
]);

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
