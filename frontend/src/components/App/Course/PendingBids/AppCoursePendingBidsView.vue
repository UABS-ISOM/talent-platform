<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Pending Bids</h2>
  </div>

  <p class="q-pa-sm q-mb-none">
    Here you can approve bids for projects before they are sent to industry
    representatives.
  </p>

  <div class="q-pa-sm">
    <template v-if="projects !== undefined && error === null">
      <q-list>
        <AppCoursePendingProjectsItem
          v-for="{ id, bid, bidStatus, project, group } in projects"
          :key="id"
          :course-id="(courseId as string)"
          :group-project-id="id"
          :bid="bid"
          :bid-status="bidStatus"
          :project-name="project.name"
          :project-overview="project.overview ?? ''"
          :project-owner-name="project.owner.name"
          :group-name="group.name"
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
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getErrorMessage } from "@/helpers";
import GenericNone from "@/components/GenericNone.vue";
import AppCoursePendingProjectsItem from "./AppCoursePendingBidsItem.vue";
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
    query getPendingBids($courseId: ID!) {
      course(courseId: $courseId) {
        id
        pendingBids {
          id
          bid
          bidStatus
          project {
            id
            name
            overview
            owner {
              id
              name
            }
          }
          group {
            id
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

const projects = computed(() => result.value?.course?.pendingBids);
</script>
