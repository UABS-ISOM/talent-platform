<template>
  <q-dialog v-model="show">
    <q-card style="width: 420px">
      <q-card-section class="row items-center justify-between">
        <h2 class="text-h6 q-my-none q-mr-sm">{{ title }}</h2>

        <q-btn v-close-popup flat round dense icon="mdi-close" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <slot :key="count" :show="modelValue" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  modelValue?: boolean;
  title: string;
}>();

const emit = defineEmits(["update:modelValue"]);

// Bind model to show ref
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Reset dialog on close
const count = ref(0);
watch(
  () => props.modelValue,
  () => {
    count.value++;
  }
);
</script>
