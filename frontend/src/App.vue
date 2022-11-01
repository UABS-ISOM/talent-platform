<template>
  <router-view v-if="mainStore.userLoaded" />

  <MainLoader v-else />
</template>

<script setup lang="ts">
import { useMainStore } from "@/mainStore";
import { RouterView } from "vue-router";
import MainLoader from "@/components/MainLoader.vue";

const mainStore = useMainStore();
</script>
