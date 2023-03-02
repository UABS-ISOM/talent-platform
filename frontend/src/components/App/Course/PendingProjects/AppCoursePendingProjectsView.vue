<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Pending Projects</h2>
  </div>

  <p class="q-pa-sm q-mb-none">
    Here you can approve projects that industry representatives have asked to be
    displayed to students.
  </p>

  <div class="q-pa-sm">
    <template v-if="projects !== undefined && error === null">
      <q-list>
        <AppCoursePendingProjectsItem
          v-for="{ id, name, overview, owner: { name: ownerName } } in projects"
          :key="id"
          :course-id="(courseId as string)"
          :project-id="id"
          :name="name"
          :owner-name="ownerName"
          :overview="overview ?? ''"
          @removed-item="refetch"
        />
      </q-list>

      <div class="full-width q-pa-sm">
        <GenericNone v-if="projects.length === 0">
          There aren't any projects pending approval in this course.
        </GenericNone>
      </div>
    </template>

    <template v-else-if="loading || error">
      <template v-if="loading">
        <q-skeleton
          v-for="i in 3"
          :key="i"
          size="52px"
          class="full-width q-my-sm"
          animation="fade"
        />
      </template>

      <GenericAlert
        :model-value="error !== null"
        static
        type="error"
        class="full-width"
      >
        {{ getErrorMessage(error) }}
      </GenericAlert>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getErrorMessage } from "@/helpers";
import GenericNone from "@/components/GenericNone.vue";
import AppCoursePendingProjectsItem from "./AppCoursePendingProjectsItem.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";

// Get the course ID
const {
  params: { courseId },
} = useRoute();

// Query the course
const { result, loading, error, refetch } = useQuery(
  graphql(`
    query getPendingProjects($courseId: ID!) {
      course(courseId: $courseId) {
        id
        pendingProjects {
          id
          name
          overview
          owner {
            name
          }
        }
      }
    }
  `),
  {
    courseId: courseId as string,
    options: { query: null } as { query: string | null },
  },
  { fetchPolicy: "cache-and-network" }
);

const projects = computed(() => result.value?.course?.pendingProjects);
</script>
