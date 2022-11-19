<template>
  <GenericPage v-if="me !== undefined" class="row">
    <div class="col-12 col-md-4 col-lg-3 q-pa-sm">
      <ProfileSideCard
        :name="me.name"
        :photo-url="me.photoUrl"
        :roles="me.roles"
        :pronouns="me.pronouns ?? undefined"
        @save="save"
      />
    </div>

    <div class="col-12 col-md-8 col-lg-9 q-pa-sm">
      <ProfileOverviewCard :overview="me.overview" @save="save" />

      <ProfileSkillsCard :skills="me.skills" @save="save" />
    </div>
  </GenericPage>

  <GenericPage v-else-if="getMeLoading || getMeError" class="row">
    <ProfileLoader v-if="getMeLoading" />

    <GenericAlert
      :model-value="getMeError !== null"
      static
      type="error"
      class="full-width"
    >
      {{ GENERIC_ERROR }}
    </GenericAlert>
  </GenericPage>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { graphql } from "@/gql/__generated__";
import type { EditMeInput } from "@/gql/__generated__/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { computed } from "vue";
import ProfileSideCard from "./ProfileSideCard.vue";
import ProfileOverviewCard from "./ProfileOverviewCard.vue";
import ProfileSkillsCard from "./ProfileSkillsCard.vue";
import GenericPage from "@/components/GenericPage.vue";
import ProfileLoader from "./ProfileLoader.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import { GENERIC_ERROR } from "@/helpers";

// Get the user's profile
const {
  result: getMeResult,
  loading: getMeLoading,
  error: getMeError,
} = useQuery(
  graphql(`
    query getMe {
      me {
        id
        name
        email
        photoUrl
        roles
        pronouns
        overview
        skills
        courses {
          id
        }
      }
    }
  `),
  null,
  { fetchPolicy: "cache-and-network" }
);
const me = computed(() => getMeResult.value?.me ?? undefined);

// Mutation to save the user's profile
const { mutate: editMe } = useMutation(
  graphql(`
    mutation EditMeMutation($input: EditMeInput!) {
      editMe(input: $input) {
        id
        name
        email
        photoUrl
        roles
        pronouns
        overview
        skills
      }
    }

    input EditMeInput {
      overview: String
      skills: [String!]
    }
  `)
);

/**
 * Saves the input to the editMe mutation
 * @param input The input to save.
 * @param loading Vue ref to set loading status.
 * @param error Vue ref to set error status.
 */
const save = async (
  input: EditMeInput,
  loading: Ref<boolean>,
  error: Ref<boolean>,
  onSuccess: () => void
) => {
  error.value = false;
  loading.value = true;

  try {
    // Add the course and redirect to the course page
    await editMe({ input });
    onSuccess();
  } catch (e) {
    error.value = true;
  }

  loading.value = false;
};
</script>
