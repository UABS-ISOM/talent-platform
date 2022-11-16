<template>
  <q-page class="row content-start">
    <div
      :class="`col-12 col-sm-10 col-xl-8 q-mx-auto q-pa-sm ${
        props.class ?? ''
      }`"
      :style="props.style"
    >
      <slot />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { StyleValue } from "vue";

const props = defineProps<{
  class?: unknown;
  style?: StyleValue;
}>();
</script>
