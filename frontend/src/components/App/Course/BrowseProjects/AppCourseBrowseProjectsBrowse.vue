<template>
  <div class="text-h6">Browse Projects</div>
  <p>
    Here you can browse projects available to make bids on for this course. You
    can add them to your group's starred list.
  </p>

  <template v-if="projects !== undefined && error === null">
    <q-list>
      <q-list>
        <AppCourseBrowseProjectsBrowseItem
          v-for="{
            id,
            name,
            overview,
            owner: { name: ownerName },
            groupProject,
          } in projects"
          :key="id"
          :course-id="props.courseId"
          :project-id="id"
          :name="name"
          :overview="overview ?? ''"
          :owner-name="ownerName"
          :starred="groupProject?.starred ?? false"
        />
      </q-list>
    </q-list>

    <div class="full-width q-pa-sm">
      <GenericNone v-if="projects.length === 0">
        There aren't any projects available to bid on yet.
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
</template>

<script setup lang="ts">
import GenericAlert from "@/components/GenericAlert.vue";
import GenericNone from "@/components/GenericNone.vue";
import { graphql } from "@/gql/__generated__";
import { getErrorMessage } from "@/helpers";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import AppCourseBrowseProjectsBrowseItem from "./AppCourseBrowseProjectsBrowseItem.vue";

const props = defineProps<{
  courseId: string;
}>();

// Query the course
const { result, loading, error, refetch } = useQuery(
  graphql(`
    query getActiveProjects($courseId: ID!) {
      course(courseId: $courseId) {
        id
        activeProjects {
          id
          name
          overview
          owner {
            name
          }
          groupProject {
            id
            starred
          }
        }
      }
    }
  `),
  {
    courseId: props.courseId as string,
  },
  { fetchPolicy: "cache-and-network" }
);

const projects = computed(() => result.value?.course?.activeProjects);
</script>
