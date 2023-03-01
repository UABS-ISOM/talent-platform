<template>
  <p class="q-pa-sm q-mb-none">
    Here you can view and edit the bids on your project.
  </p>

  <div class="q-pa-sm">
    <template v-if="bids !== undefined && error === null">
      <q-list>
        <AppCourseEditProjectBidsItem
          v-for="{
            id,
            bid,
            group: { id: groupId, name: groupName, users },
          } in bids"
          :key="id"
          :bid="bid"
          :group-name="groupName"
          :users="users"
          :course-id="courseId"
          :group-id="groupId"
        />
      </q-list>

      <div class="full-width q-pa-sm">
        <GenericNone v-if="bids.length === 0">
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
import { getErrorMessage } from "@/helpers";
import GenericNone from "@/components/GenericNone.vue";
import AppCourseEditProjectBidsItem from "./AppCourseEditProjectBidsItem.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";

const props = defineProps<{
  courseId: string;
  projectId: string;
}>();

// Query the course
const { result, loading, error } = useQuery(
  graphql(`
    query getCourseProjectBids($courseId: ID!, $projectId: ID!) {
      courseProject(courseId: $courseId, projectId: $projectId) {
        id
        approvedBids {
          id
          bid
          group {
            id
            name
            users {
              id
              groupId
              user {
                id
                photoUrl
                name
              }
            }
          }
        }
      }
    }
  `),
  { courseId: props.courseId, projectId: props.projectId },
  { fetchPolicy: "cache-and-network" }
);

const bids = computed(() => result.value?.courseProject.approvedBids);
</script>
