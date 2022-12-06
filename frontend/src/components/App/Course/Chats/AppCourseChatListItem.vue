<template>
  <q-item
    v-ripple
    clickable
    class="q-py-md q-px-lg"
    :to="{ name: 'AppCourseChat', params: { chatId: id } }"
  >
    <q-item-section avatar>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{
        members.map((member) => member.name).join(", ")
      }}</q-item-label>
      <q-item-label caption lines="1">
        <span class="text-weight-bold">{{ lastMessage.sender }}</span>
        {{ lastMessage.message }}
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      {{ timeString }}
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  members: { name: string }[];
  lastMessage: {
    sender: string;
    message: string;
    created: number;
  };
  timeString: string;
}>();
</script>
