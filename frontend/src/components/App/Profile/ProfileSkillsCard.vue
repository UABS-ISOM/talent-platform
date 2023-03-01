<template>
  <ProfileCard v-model="editMode" title="Skills" :readonly="readonly">
    <template v-if="editMode">
      <q-form autofocus @submit="addSkill">
        <q-input
          ref="input"
          v-model="newSkill"
          outlined
          hide-bottom-space
          bottom-slots
          label="New skill"
          :dense="true"
          class="q-mb-md"
        >
          <template #after>
            <q-btn
              type="submit"
              round
              dense
              flat
              icon="mdi-plus"
              @click="addSkill"
            />
          </template>
        </q-input>
      </q-form>

      <div style="margin: -4px -4px 12px -4px">
        <q-chip
          v-for="(skill, index) in newSkills"
          :key="index"
          removable
          :ripple="false"
          @remove="removeSkill(index)"
        >
          {{ skill }}
        </q-chip>
      </div>

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
          @click="save"
        />
      </div>
    </template>

    <template v-else>
      <p v-if="skills.length == 0" class="text-grey-6">
        <template v-if="readonly">
          This user hasn't written anything here.
        </template>
        <template v-else>
          You can add a list of your skills here. This will be displayed on your
          profile.
        </template>
      </p>

      <div v-else style="margin: -4px -4px 16px -4px">
        <q-chip v-for="(skill, index) in skills" :key="index" :ripple="false">
          {{ skill }}
        </q-chip>
      </div>
    </template>
  </ProfileCard>
</template>

<script setup lang="ts">
import { ref, watch, type VNodeRef } from "vue";
import ProfileCard from "./ProfileCard.vue";
import type { EditMeInput } from "@/gql/__generated__/graphql";
import GenericAlert from "@/components/GenericAlert.vue";
import { GENERIC_ERROR } from "@/helpers";

const props = defineProps<{
  skills: string[];
  readonly?: boolean;
}>();

const emit = defineEmits(["save"]);

// Form values
const editMode = ref(false);
const newSkill = ref("");
const newSkills = ref<string[]>([]);

const input = ref<VNodeRef | null>(null);
const loading = ref(false);
const error = ref(false);

// Set fields to current values when editMode is enabled
watch(editMode, (value) => {
  if (value) {
    newSkill.value = "";
    newSkills.value = props.skills;
  }
});

/**
 * Adds a new skill to the list of new skills.
 */
const addSkill = () => {
  if (newSkill.value === "") return;

  newSkills.value = [...newSkills.value, newSkill.value];
  newSkill.value = "";
  input.value.focus();
};

/**
 * Removes a skill from the list of new skills.
 */
const removeSkill = (index: number) => {
  newSkills.value = newSkills.value.filter((_, i) => i !== index);
};

/**
 * Saves the new skills.
 */
const save = () => {
  emit(
    "save",
    {
      skills: newSkills.value,
    } as EditMeInput,
    loading,
    error,
    () => {
      editMode.value = false;
    }
  );
};
</script>
