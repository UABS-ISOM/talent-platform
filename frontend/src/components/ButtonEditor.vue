<template>
  <div
    v-bind="outerProps"
    class="flex no-wrap justify-between items-center"
    style="gap: 8px"
  >
    {{ value !== "" ? value : defaultText ?? "" }}

    <q-btn
      v-if="!readonly"
      flat
      round
      icon="mdi-pencil"
      v-bind="buttonProps"
      :loading="loading"
      :disable="loading"
    >
      <q-popup-edit
        v-slot="scope"
        v-model="value"
        buttons
        anchor="top left"
        label-set="Save"
        v-bind="popupProps"
      >
        <q-input
          v-model="scope.value"
          dense
          autofocus
          v-bind="inputProps"
          @keyup.enter="scope.set"
        />
      </q-popup-edit>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
  loading?: boolean;
  defaultText?: string;
  readonly?: boolean;
  outerProps?: {
    [key: string]: any;
  };
  popupProps?: {
    [key: string]: any;
  };
  inputProps?: {
    [key: string]: any;
  };
  buttonProps?: {
    [key: string]: any;
  };
}>();

const emit = defineEmits(["update:modelValue"]);

// Bind model to show ref
const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
