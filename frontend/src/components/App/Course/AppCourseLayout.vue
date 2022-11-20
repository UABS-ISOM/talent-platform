<template>
  <AppCourseSidebar
    v-if="course !== undefined"
    :name="course?.name ?? ''"
    :description="course?.description ?? ''"
  >
    <router-view />
  </AppCourseSidebar>

  <template v-else-if="loading || error">
    <AppCourseLoader v-if="loading" />

    <GenericPage>
      <GenericAlert
        :model-value="error !== null"
        static
        type="error"
        class="full-width"
      >
        {{ GENERIC_ERROR }}
      </GenericAlert>
    </GenericPage>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import { useRoute } from "vue-router";
import AppCourseSidebar from "./AppCourseSidebar.vue";
import AppCourseLoader from "./AppCourseLoader.vue";
import { GENERIC_ERROR } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import GenericPage from "@/components/GenericPage.vue";

const {
  params: { courseId },
} = useRoute();

// Get the course
const { result, loading, error } = useQuery(
  graphql(`
    query getCourse($courseId: ID!) {
      course(courseId: $courseId) {
        id
        name
        description
      }
    }
  `),
  { courseId: courseId as string },
  { fetchPolicy: "cache-and-network" }
);
const course = computed(() => result.value?.course ?? undefined);
</script>
