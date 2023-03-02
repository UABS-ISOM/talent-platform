<template>
  <q-expansion-item popup default-opened :label="`Bid by ${groupName}`">
    <q-separator />
    <q-card>
      <q-card-section>
        <q-card-section v-if="bid === ''" class="text-grey-6">
          There isn't an overview for this project.
        </q-card-section>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-else class="truncated-paragraph q-mb-none" v-html="bid" />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
defineProps<{
  bid: string;
  groupName: string;
}>();
</script>
