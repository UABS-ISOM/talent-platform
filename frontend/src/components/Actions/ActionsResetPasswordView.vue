<template>
  <AuthCard>
    <div class="q-py-sm">
      <AuthHeader>Reset your password</AuthHeader>

      <GenericAlert v-model="codeError" type="error" class="q-py-md" static>
        {{ GENERIC_ERROR }} Otherwise, your link could be invalid.
      </GenericAlert>

      <q-spinner-dots
        v-if="codeLoading"
        color="primary"
        size="xl"
        aria-label="Loading"
        class="block q-mx-auto q-my-sm"
      />

      <q-form v-else-if="!codeError" autofocus @submit="onSubmit">
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
            readonly
            :disable="success"
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
            :disable="success"
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
            :disable="success"
          >
            <template #prepend>
              <q-icon name="mdi-lock" />
            </template>
          </q-input>
        </div>

        <GenericAlert v-model="success" type="success" class="q-py-sm" static>
          Password successfully reset.
        </GenericAlert>

        <GenericAlert v-model="error" type="error" class="q-py-sm">
          {{ GENERIC_ERROR }}
        </GenericAlert>

        <div class="q-py-sm">
          <q-btn
            no-caps
            unelevated
            :loading="loading"
            type="submit"
            color="primary"
            class="full-width"
            icon="mdi-lock-reset"
            label="Reset password"
            :disable="success"
          />
        </div>
      </q-form>
    </div>
  </AuthCard>
</template>

<script setup lang="ts">
import { RULES, GENERIC_ERROR } from "@/helpers";
import { ref, onMounted } from "vue";
import AuthCard from "@/components/Auth/AuthCard.vue";
import AuthHeader from "@/components/Auth/AuthHeader.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRoute } from "vue-router";
import router from "@/router";

const auth = getAuth();

// Get the action code from the URL
const actionCode = useRoute().query.oobCode as string;

// Show status of the code
const codeError = ref(false);
const codeLoading = ref(true);

// Form values
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// Form status
const error = ref(false);
const success = ref(false);
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

// Verify the action code on mount
onMounted(async () => {
  verifyPasswordResetCode(auth, actionCode)
    .then((codeEmail) => {
      email.value = codeEmail;
    })
    .catch(() => {
      // Invalid or expired action code.
      codeError.value = true;
    })
    .finally(() => {
      codeLoading.value = false;
    });
});

/**
 * Resets the user's password.
 */
const onSubmit = async () => {
  error.value = false;
  loading.value = true;

  const newPassword = password.value;
  confirmPasswordReset(auth, actionCode, newPassword)
    .then(async () => {
      // Password reset
      success.value = true;

      // Sign the user in
      try {
        await signInWithEmailAndPassword(auth, email.value, newPassword);
        await router.push("/");
      } catch (e) {
        // Ignore
      }
    })
    .catch(() => {
      // Error occurred
      error.value = true;
    })
    .finally(() => {
      // Catch all
      loading.value = false;
    });
};
</script>
