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
      :name="sender"
      :sent="sender === 'Andrew'"
      :avatar="
        sender !== 'Andrew'
          ? 'https://cdn.quasar.dev/img/avatar2.jpg'
          : undefined
      "
    />
  </q-infinite-scroll>
</template>

<script setup lang="ts">
import type { QInfiniteScrollProps } from "quasar";

const chats = [
  {
    id: "E8R4P34FB474P30D",
    sender: "Andrew",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Rebecca",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Andrew",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Rebecca",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Andrew",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Rebecca",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Andrew",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Rebecca",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Andrew",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Rebecca",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Andrew",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
  {
    id: "E8R4P34FB474P30D",
    sender: "Rebecca",
    message: "Lorem ipsum dolor sit amet paparti am inim.",
    created: new Date().getTime(),
  },
];

/**
 * Loads more chats from Firestore.
 * @param index The number of chats calls to load already made.
 * @param done The function to call when the loading is done.
 */
const onLoad: QInfiniteScrollProps["onLoad"] = (index, done) => {};
</script>
