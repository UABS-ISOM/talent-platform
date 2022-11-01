<template>
  <q-layout
    :style="{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflowX: 'hidden',
    }"
  >
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          :enter-active-class="`animate__animated ${animation} animate__faster`"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import background from "@/assets/background.jpg";

const animation = ref<"animate__fadeInLeft" | "animate__fadeInRight">(
  "animate__fadeInRight"
);

onBeforeRouteUpdate((to) => {
  if (to.name === "Auth") {
    animation.value = "animate__fadeInLeft";
  } else {
    animation.value = "animate__fadeInRight";
  }
});
</script>
