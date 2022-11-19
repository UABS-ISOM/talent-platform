<template>
  <q-page class="row no-wrap" style="max-width: 100vw; overflow-x: hidden">
    <div
      class="flex row no-wrap"
      :style="{
        width: showDrawer || !$q.screen.lt.md ? '241px' : '0px',
        height: $q.screen.lt.md ? '100%' : undefined,
        position: $q.screen.lt.md ? 'absolute' : 'static',
        overflowX: 'hidden',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'white',
        flexShrink: 0,
        zIndex: 2,
      }"
    >
      <q-list padding style="min-width: 240px">
        <q-item>
          <q-btn
            v-if="$q.screen.lt.md"
            flat
            round
            color="primary"
            icon="mdi-chevron-left"
            class="q-mr-md"
            @click="showDrawer = false"
          />

          <q-item-section style="min-height: 42px">
            <q-item-label>Course name</q-item-label>
            <q-item-label caption>Course sub</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-for="(link, index) in links" :key="index" v-ripple clickable>
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
      </q-list>

      <q-separator vertical />
    </div>

    <div class="full-width" style="position: relative; overflow: auto">
      <q-btn
        v-if="$q.screen.lt.md && !showDrawer"
        unelevated
        round
        color="primary"
        style="
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          position: absolute;
        "
        class="q-my-md"
        icon="mdi-chevron-right"
        @click="showDrawer = true"
      />

      <div
        class="app-course-view__content-overlay"
        :class="{
          'app-course-view__content-overlay--show':
            $q.screen.lt.md && showDrawer,
        }"
        @click="showDrawer = false"
      />

      <div class="q-pa-sm">
        <router-view />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";

const showDrawer = ref(false);
const $q = useQuasar();

const links = ref([
  { icon: "mdi-inbox", label: "Inbox" },
  { icon: "mdi-star", label: "Star" },
  { icon: "mdi-send", label: "Send" },
]);
</script>

<style scoped>
.app-course-view__content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0s 0.2s;
  z-index: 1;
}
.app-course-view__content-overlay--show {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0s 0s;
}
</style>
