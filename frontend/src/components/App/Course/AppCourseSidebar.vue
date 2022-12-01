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
        <q-item class="items-center">
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
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label caption>{{ description }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-for="({ icon, label, to }, index) in links"
          :key="index"
          v-ripple
          :to="to"
          exact
          clickable
          @click="showDrawer = false"
        >
          <q-item-section avatar>
            <q-icon :name="icon" />
          </q-item-section>

          <q-item-section>{{ label }}</q-item-section>
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
        <slot />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

defineProps<{
  name: string;
  description: string;
}>();

const showDrawer = ref(false);
const $q = useQuasar();
const {
  params: { courseId },
} = useRoute();

const links = ref([
  {
    icon: "mdi-school",
    label: "Staff",
    to: { name: "AppCourseStaff", params: { courseId } },
  },
  {
    icon: "mdi-account",
    label: "Students",
    to: { name: "AppCourseStudents", params: { courseId } },
  },
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
