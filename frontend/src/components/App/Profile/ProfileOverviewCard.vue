<template>
  <ProfileCard v-model="editMode" title="About Me">
    <q-form v-if="editMode" @submit.prevent="save">
      <q-editor
        ref="editor"
        v-model="newOverview"
        min-height="5rem"
        class="q-mb-md"
        :toolbar="[
          ['bold', 'italic', 'underline'],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
          ['undo', 'redo'],
        ]"
      />

      <GenericAlert v-model="error" type="error" class="full-width q-mb-md">
        {{ GENERIC_ERROR }}
      </GenericAlert>

      <div class="row justify-end q-mb-md">
        <q-btn
          no-caps
          unelevated
          :loading="loading"
          type="submit"
          color="primary"
          icon="mdi-content-save"
          label="Save"
        />
      </div>
    </q-form>

    <template v-else>
      <p v-if="overview === ''" class="text-grey-6">
        You can add a short bio here. This will be displayed on your profile.
      </p>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-else v-html="overview" />
    </template>
  </ProfileCard>
</template>

<script setup lang="ts">
import type { QEditor } from "quasar";
import { nextTick, ref, watch, type VNodeRef } from "vue";
import ProfileCard from "./ProfileCard.vue";
import type { EditMeInput } from "@/gql/__generated__/graphql";
import { GENERIC_ERROR } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";

const props = defineProps<{
  overview: string;
}>();

const emit = defineEmits(["save"]);

// Form values
const editMode = ref(false);
const newOverview = ref("");

const editor = ref<VNodeRef | null>(null);
const loading = ref(false);
const error = ref(false);

// Set fields to current values when editMode is enabled
watch(editMode, (value) => {
  if (value) {
    newOverview.value = props.overview;
    editor.value?.focus();

    nextTick(() => {
      editor.value.focus();
    });
  }
});

/**
 * Saves the new overview.
 */
const save = () =>
  emit(
    "save",
    {
      overview: newOverview.value,
    } as EditMeInput,
    loading,
    error,
    () => {
      editMode.value = false;
    }
  );
</script>
