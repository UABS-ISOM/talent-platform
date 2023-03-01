<template>
  <div v-if="student !== undefined" class="row">
    <div class="col-12 col-md-4 col-lg-3 q-pa-sm">
      <ProfileSideCard
        :name="student.user.name"
        :photo-url="student.user.photoUrl"
        :roles="student.user.roles"
        :pronouns="student.user.pronouns ?? undefined"
        :readonly="true"
      />

      <q-card v-if="student.group" flat bordered class="q-pa-sm q-mt-md">
        <AppCourseGroupDialog
          :name="student.group.name"
          :users="student.group.users"
          :course-id="courseId"
          :group-id="student.group.id"
        />
      </q-card>
    </div>

    <div class="col-12 col-md-8 col-lg-9 q-pa-sm">
      <ProfileOverviewCard :overview="student.user.overview" :readonly="true" />

      <ProfileSkillsCard :skills="student.user.skills" :readonly="true" />
    </div>
  </div>

  <div v-else-if="loading || error" class="row">
    <ProfileLoader v-if="loading" />

    <GenericAlert
      :model-value="error !== null"
      static
      type="error"
      class="full-width"
    >
      {{ GENERIC_ERROR }}
    </GenericAlert>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import { GENERIC_ERROR } from "@/helpers";
import ProfileSideCard from "@/components/App/Profile/ProfileSideCard.vue";
import ProfileOverviewCard from "@/components/App/Profile/ProfileOverviewCard.vue";
import ProfileSkillsCard from "@/components/App/Profile/ProfileSkillsCard.vue";
import ProfileLoader from "@/components/App/Profile/ProfileLoader.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import AppCourseGroupDialog from "../AppCourseGroupDialog.vue";

const props = defineProps<{
  courseId: string;
  uid: string;
}>();

// Get the user's profile
const { result, loading, error } = useQuery(
  graphql(`
    query CourseStudent($courseId: ID!, $uid: String!) {
      courseStudent(courseId: $courseId, uid: $uid) {
        groupId
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
        id
        user {
          id
          name
          overview
          photoUrl
          pronouns
          roles
          skills
        }
      }
    }
  `),
  { courseId: props.courseId, uid: props.uid },
  { fetchPolicy: "cache-and-network" }
);
const student = computed(() => result.value?.courseStudent ?? undefined);
</script>
