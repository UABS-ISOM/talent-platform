<template>
  <q-card flat bordered dark class="bg-secondary text-center">
    <q-card-section>
      <q-avatar
        size="140px"
        style="max-width: 100%"
        class="flex justify-center q-mx-auto"
      >
        <img :src="photoUrl" style="max-width: 100%" class="q-pa-sm" />
      </q-avatar>

      <div class="q-pa-sm">
        <h2 class="text-h6 q-my-none q-mb-sm">
          {{ name }}

          <span v-if="pronouns" class="text-weight-regular text-grey-5">
            {{ pronouns }}
          </span>
        </h2>

        <div class="text-subtitle1 q-mb-sm">{{ roleText }}</div>

        <!-- <q-chip :ripple="false">ENGGEN 204</q-chip> -->
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Role } from "@/gql/__generated__/graphql";

const props = defineProps<{
  name: string;
  photoUrl: string;
  roles: Role[];
  pronouns?: string;
}>();

// Comvert roles to displayable text
const roleText = computed(() =>
  props.roles
    .map((role) => role.charAt(0) + role.slice(1).toLowerCase())
    .join(", ")
);
</script>
