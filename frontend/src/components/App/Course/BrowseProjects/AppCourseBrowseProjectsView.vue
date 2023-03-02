<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Browse Projects</h2>
  </div>

  <q-tabs
    v-if="isStudent"
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
    style="margin: 0 -8px"
  >
    <q-tab name="browse" label="Browse Projects" no-caps />
    <q-tab v-if="isStudent" name="starred" label="Starred Projects" no-caps />
    <q-tab v-if="isStudent" name="bids" label="Projects with Bids" no-caps />
  </q-tabs>

  <q-separator v-if="isStudent" style="margin: 0 -8px" />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="browse" class="q-pa-sm">
      <AppCourseBrowseProjectsBrowse
        :is-student="isStudent"
        :course-id="(courseId as string)"
        mode="browse"
      />
    </q-tab-panel>

    <q-tab-panel name="starred" class="q-pa-sm">
      <AppCourseBrowseProjectsBrowse
        :is-student="isStudent"
        :course-id="(courseId as string)"
        mode="starred"
      />
    </q-tab-panel>

    <q-tab-panel name="bids" class="q-pa-sm">
      <AppCourseBrowseProjectsBrowse
        :is-student="isStudent"
        :course-id="(courseId as string)"
        mode="bids"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { graphql } from "@/gql/__generated__";
import { useQuery } from "@vue/apollo-composable";
import { useRoute } from "vue-router";
import AppCourseBrowseProjectsBrowse from "./AppCourseBrowseProjectsBrowse.vue";
import { CourseMemberEnum } from "@/gql/__generated__/graphql";

const route = useRoute();
const { courseId } = route.params;

const tab = ref("browse");

// Get the course
const { result } = useQuery(
  graphql(`
    query getCourseRole($courseId: ID!) {
      course(courseId: $courseId) {
        id
        myRole
      }
    }
  `),
  { courseId: courseId as string },
  { fetchPolicy: "cache-only" }
);

const isStudent = computed(
  () => result.value?.course?.myRole === CourseMemberEnum.Student
);
</script>
