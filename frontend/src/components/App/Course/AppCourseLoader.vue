<template>
  <q-page class="row no-wrap" style="max-width: 100vw; overflow-x: hidden">
    <div
      v-if="!$q.screen.lt.md"
      class="flex row no-wrap"
      :style="{
        width: '241px',
        overflowX: 'hidden',
        flexShrink: 0,
      }"
    >
      <q-list padding style="min-width: 240px">
        <q-item>
          <q-item-section style="min-height: 42px">
            <q-skeleton type="text" animation="fade" />
            <q-skeleton type="text" animation="fade" />
          </q-item-section>
        </q-item>

        <q-item v-for="i in 3" :key="i">
          <q-item-section avatar>
            <q-skeleton type="circle" size="24px" animation="fade" />
          </q-item-section>

          <q-item-section>
            <q-skeleton type="text" animation="fade" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator vertical />
    </div>

    <div
      class="flex items-center justify-center full-width"
      style="position: relative; overflow: auto"
    >
      <q-spinner-dots color="primary" size="xl" aria-label="Loading" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
const $q = useQuasar();
</script>
