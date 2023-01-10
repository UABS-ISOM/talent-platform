<template>
  <div
    class="flex row no-wrap"
    style="
      height: calc(100% + 1rem);
      overflow-x: hidden;
      position: relative;
      margin: -0.5rem;
    "
  >
    <AppCourseChatList
      v-if="$q.screen.gt.sm || !route.params.chatId"
      :course-id="(route.params.courseId as string)"
    />

    <router-view v-if="$q.screen.gt.sm || route.params.chatId" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import AppCourseChatList from "./AppCourseChatList.vue";

const route = useRoute();
</script>
