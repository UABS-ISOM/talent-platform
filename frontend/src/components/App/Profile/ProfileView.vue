<template>
  <q-page v-if="me !== undefined" class="row content-start">
    <div class="row col-12 col-sm-10 col-xl-8 q-pa-sm q-mx-auto">
      <div class="col-12 col-sm-5 col-md-4 col-lg-3 q-pa-sm">
        <ProfileSideCard
          :name="me.name"
          :photo-url="me.photoUrl"
          :roles="me.roles"
          :pronouns="me.pronouns ?? undefined"
        />
      </div>

      <div class="col-12 col-sm-7 col-md-8 col-lg-9 q-pa-sm">
        <ProfileOverviewCard :overview="me.overview" @save="save" />

        <ProfileSkillsCard :skills="me.skills" @save="save" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { graphql } from "@/gql/__generated__";
import type { EditMeInput } from "@/gql/__generated__/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { computed } from "vue";
import ProfileSideCard from "./ProfileSideCard.vue";
import ProfileOverviewCard from "./ProfileOverviewCard.vue";
import ProfileSkillsCard from "./ProfileSkillsCard.vue";

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
      }
    }
  `)
);

const me = computed(() => getMeResult.value?.me ?? undefined);

// Form status
const error = ref(false);
const loading = ref(false);

const { mutate: editMe } = useMutation(
  graphql(`
    mutation EditMeMutation($input: EditMeInput!) {
      editMe(input: $input) {
        id
      }
    }

    input EditMeInput {
      overview: String
      skills: [String!]
    }
  `)
);

const save = async (input: EditMeInput) => {
  error.value = false;
  loading.value = true;

  try {
    // Add the course and redirect to the course page
    const data = await editMe({ input });
    console.log(data);
  } catch (e) {
    error.value = true;
    loading.value = false;
  }
};
</script>
