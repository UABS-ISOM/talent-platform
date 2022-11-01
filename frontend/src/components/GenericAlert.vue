<template>
  <transition
    enter-active-class="animate__animated animate__fadeInUp animate__faster"
  >
    <div v-if="show" :class="props.class" :style="props.style">
      <q-card
        class="flex items-center no-wrap q-pa-sm white-text"
        :class="{
          'bg-negative': props.type === 'error',
          'bg-positive': props.type === 'success',
        }"
        flat
        bordered
      >
        <q-icon
          :name="props.type === 'error' ? 'mdi-alert' : 'mdi-party-popper'"
          aria-label="Close alert"
          left
          size="sm"
        />

        <span style="flex-grow: 1">
          <slot />
        </span>

        <q-btn
          round
          color="white"
          flat
          icon="mdi-close"
          size="sm"
          @click="show = false"
        />
      </q-card>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { StyleValue } from "vue";

const props = defineProps<{
  class?: unknown;
  style?: StyleValue;
  modelValue?: boolean;
  type: "error" | "success";
}>();

const emit = defineEmits(["update:modelValue"]);

// Bind model to show ref
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
