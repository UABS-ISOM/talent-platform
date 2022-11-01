<template>
  <AuthCard>
    <div class="q-py-sm">
      <AuthHeader>Sign Up</AuthHeader>

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

        <div class="q-py-sm">
          <q-input
            v-model="password"
            autocomplete="new-password"
            no-error-icon
            hide-bottom-space
            :rules="[RULES.required, passwordLengthRule]"
            type="password"
            label="Password"
          >
            <template #prepend>
              <q-icon name="mdi-lock" />
            </template>
          </q-input>
        </div>

        <div class="q-py-sm">
          <q-input
            v-model="confirmPassword"
            autocomplete="new-password"
            no-error-icon
            hide-bottom-space
            :rules="[RULES.required, confirmPasswordRule]"
            type="password"
            label="Confirm password"
          >
            <template #prepend>
              <q-icon name="mdi-lock" />
            </template>
          </q-input>
        </div>

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
            icon="mdi-account-plus"
            label="Sign Up"
          />
        </div>
      </q-form>
    </div>
  </AuthCard>
</template>

<script setup lang="ts">
import { RULES, GENERIC_ERROR } from "@/helpers";
import { ref } from "vue";
import AuthCard from "../AuthCard.vue";
import AuthHeader from "../AuthHeader.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Form values
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// Form status
const error = ref(false);
const errorMessage = ref("");
const loading = ref(false);

/**
 * Enforce password length.
 */
const passwordLengthRule = (v: string) =>
  v.length >= 6 || "Password must be at least six characters.";

/**
 * Enforce password confirmation is the same as password.
 */
const confirmPasswordRule = (v: string) =>
  v === password.value || "Passwords must match.";

/**
 * Signs up a user with Firebase authentication.
 */
const onSubmit = () => {
  error.value = false;
  loading.value = true;

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .catch((reason) => {
      // Error occurred
      switch (reason.code) {
        case "auth/email-already-in-use":
          errorMessage.value = "Account already exists.";
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
