<template>
  <q-card
    flat
    bordered
    class="flex column no-wrap q-my-md q-mr-md col-grow"
    style="position: sticky; top: 1rem"
  >
    <q-card-section class="row items-center q-pa-sm">
      <q-btn
        v-if="$q.screen.lt.md"
        no-caps
        outline
        color="primary"
        icon="mdi-chevron-left"
        label="Back"
        class="q-ml-xl q-mr-md"
        :to="{ name: 'AppCourseChats' }"
      />

      <div class="text-h6">Our Changing Planet</div>
    </q-card-section>

    <q-separator />
    <AppCourseChatMessages />
    <q-separator />
    <AppCourseChatInput />
  </q-card>
</template>

<script setup lang="ts">
import AppCourseChatInput from "./AppCourseChatInput.vue";
import AppCourseChatMessages from "./AppCourseChatMessages.vue";
</script>
