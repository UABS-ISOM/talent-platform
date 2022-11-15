<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="q-pb-none">
      <div class="row items-center justify-between q-mb-sm">
        <h2 class="text-h6 q-my-none q-mr-sm">{{ props.title }}</h2>
        <q-btn
          v-if="editMode"
          flat
          round
          color="primary"
          icon="mdi-close"
          @click="editMode = false"
        />
        <q-btn
          v-else
          flat
          round
          color="primary"
          icon="mdi-pencil"
          @click="editMode = true"
        />
      </div>

      <slot :edit-mode="editMode" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title: string;
  modelValue?: boolean; // Whether the card is in edit mode
}>();

const emit = defineEmits(["update:modelValue"]);

// Bind model to show ref
const editMode = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
