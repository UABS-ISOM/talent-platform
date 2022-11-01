<template>
  <AuthCard>
    <div class="q-py-sm">
      <AuthHeader>Forgotten your password?</AuthHeader>

      <q-form autofocus @submit="onSubmit">
        <div class="q-py-sm">
          <q-input
            v-model="email"
            autocomplete="email"
            no-error-icon
            hide-bottom-space
            :rules="[RULES.required]"
            type="email"
            placeholder="john.smith@auckland.ac.nz"
            label="Email address"
          >
            <template #prepend>
              <q-icon name="mdi-email" />
            </template>
          </q-input>
        </div>

        <GenericAlert v-model="success" type="success" class="q-py-sm">
          Password reset email successfully sent.
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
            label="Send Reset Email"
          />
        </div>
      </q-form>
    </div>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RULES, GENERIC_ERROR } from "@/helpers";
import AuthCard from "../AuthCard.vue";
import AuthHeader from "../AuthHeader.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// Form values
const email = ref("");

// Form status
const success = ref(false);
const error = ref(false);
const errorMessage = ref("");
const loading = ref(false);

/**
 * Sends a password reset email via Firebase authentication.
 */
const onSubmit = () => {
  success.value = false;
  error.value = false;
  loading.value = true;

  const auth = getAuth();
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      // Password reset email sent
      success.value = true;
    })
    .catch((reason) => {
      // Error occurred
      switch (reason.code) {
        case "auth/user-not-found":
          errorMessage.value = "Account doesn't exist.";
          break;
        default:
          errorMessage.value = GENERIC_ERROR;
      }

      error.value = true;
    })
    .finally(() => {
      // Catch all
      loading.value = false;
    });
};
</script>
