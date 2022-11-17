<template>
  <q-card flat bordered dark class="bg-secondary text-center">
    <q-card-section class="q-pb-none">
      <q-avatar
        size="140px"
        style="max-width: 100%"
        class="flex justify-center q-mx-auto q-mb-md"
      >
        <img :src="photoUrl" style="max-width: 100%" />
      </q-avatar>

      <h2 class="text-h6 q-my-none q-mb-md">
        <ButtonEditor
          :model-value="name"
          :loading="nameLoading"
          :popup-props="{ title: 'Set your Name', validate: (v: string) => v !== '' }"
          :input-props="{ rules: [RULES.required] }"
          @update:model-value="(v) => save('name', v)"
        />

        <ButtonEditor
          :model-value="pronouns ?? ''"
          :loading="pronounsLoading"
          default-text="No pronouns set"
          :outer-props="{ class: 'text-weight-regular text-grey-5' }"
          :popup-props="{ title: 'Set your Pronouns' }"
          :button-props="{ color: 'white' }"
          @update:model-value="(v) => save('pronouns', v)"
        />
      </h2>

      <div class="text-subtitle1 q-mb-md">{{ roleText }}</div>

      <GenericAlert
        v-model="error"
        type="error"
        class="full-width q-mb-md text-left"
      >
        {{ GENERIC_ERROR }}
      </GenericAlert>

      <!-- <q-chip :ripple="false">ENGGEN 204</q-chip> -->
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { EditMeInput, Role } from "@/gql/__generated__/graphql";
import ButtonEditor from "@/components/ButtonEditor.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import { GENERIC_ERROR, RULES } from "@/helpers";

const props = defineProps<{
  name: string;
  photoUrl: string;
  roles: Role[];
  pronouns?: string;
}>();

const emit = defineEmits(["save"]);

const nameLoading = ref(false);
const pronounsLoading = ref(false);
const error = ref(false);

// Comvert roles to displayable text
const roleText = computed(() =>
  props.roles
    .map((role) => role.charAt(0) + role.slice(1).toLowerCase())
    .join(", ")
);

const save = (field: "name" | "pronouns", value: string) =>
  emit(
    "save",
    {
      [field]: value,
    } as EditMeInput,
    field === "name" ? nameLoading : pronounsLoading,
    error,
    () => {}
  );
</script>
