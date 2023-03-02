<template>
  <q-form autofocus @submit="emit('search')">
    <q-input v-model="query" outlined dense placeholder="Search">
      <template #after>
        <q-btn
          round
          dense
          flat
          icon="mdi-magnify"
          type="submit"
          @click="emit('search')"
        />
      </template>
    </q-input>
  </q-form>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue", "search"]);

// Bind model to show ref
const query = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
