<template>
  <AuthCard>
    <div class="q-py-sm">
      <div class="text-h4 q-py-md">Confirm Information</div>

      <p class="q-py-sm q-mb-none">
        Hi {{ auth.currentUser?.displayName ?? auth.currentUser?.email ?? "" }},
        we need to confirm your name and verify your email address before you
        can continue.
      </p>

      <q-form autofocus @submit="onSubmit">
        <div class="q-py-sm">
          <q-input
            v-model="name"
            autocomplete="name"
            no-error-icon
            hide-bottom-space
            :rules="[RULES.required]"
            type="text"
            placeholder="John Smith"
            label="Full name"
          />
        </div>

        <GenericAlert v-model="success" type="success" class="q-py-sm">
          Verification email successfully sent to {{ successEmailAddress }}.
        </GenericAlert>

        <GenericAlert v-model="error" type="error" class="q-py-sm">
          {{ errorMessage }}
        </GenericAlert>

        <div class="q-py-sm">
          <q-btn
            no-caps
            unelevated
            :loading="loading"
            type="submit"
            color="primary"
            class="full-width"
            icon="mdi-email-fast"
            label="Send verification email"
          />
        </div>
      </q-form>

      <ActionsSignOutButton />
    </div>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RULES, GENERIC_ERROR } from "@/helpers";
import AuthCard from "@/components/Auth/AuthCard.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import ActionsSignOutButton from "./ActionsSignOutButton.vue";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useMutation } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";

const auth = getAuth();

// Form values
const name = ref(auth.currentUser?.displayName ?? "");

// Form status
const success = ref(false);
const successEmailAddress = ref("");
const error = ref(false);
const errorMessage = ref("");
const loading = ref(false);

// Mutation to save the user's profile
const { mutate: editMe } = useMutation(
  graphql(`
    mutation ConfirmInfoMutation($input: EditMeInput!) {
      editMe(input: $input) {
        id
        name
      }
    }

    input EditMeInput {
      name: String
    }
  `)
);

/**
 * Updates the user's name then send verification email.
 */
const onSubmit = () => {
  if (auth.currentUser === null) return; // Impossible, but makes TS happy

  success.value = false;
  error.value = false;
  loading.value = true;

  Promise.all([
    editMe({ input: { name: name.value } }),
    sendEmailVerification(auth.currentUser),
  ])
    .then((data) => {
      // Password reset email sent
      successEmailAddress.value = auth.currentUser?.email ?? "";
      success.value = true;

      console.log(data);
    })
    .catch(() => {
      // Error occurred
      errorMessage.value = GENERIC_ERROR;
      error.value = true;
    })
    .finally(() => {
      // Catch all
      loading.value = false;
    });
};
</script>
