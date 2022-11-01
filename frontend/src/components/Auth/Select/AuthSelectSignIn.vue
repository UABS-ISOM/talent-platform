<template>
  <div class="q-py-sm">
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
          autocomplete="current-password"
          no-error-icon
          hide-bottom-space
          :rules="[RULES.required]"
          type="password"
          label="Password"
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
          icon="mdi-login"
          label="Sign In"
        />
      </div>
    </q-form>

    <div class="flex justify-between">
      <router-link
        :to="{ name: 'AuthSignUp' }"
        class="text-center text-dark q-py-sm"
        style="display: block"
      >
        Sign Up
      </router-link>

      <router-link
        :to="{ name: 'AuthForgottenPassword' }"
        class="text-center text-dark q-py-sm"
        style="display: block"
      >
        Forgotten your password?
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RULES, GENERIC_ERROR } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Form values
const email = ref("");
const password = ref("");

// Form status
const error = ref(false);
const errorMessage = ref("");
const loading = ref(false);

/**
 * Signs in with Firebase authentication.
 */
const onSubmit = () => {
  error.value = false;
  loading.value = true;

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch((reason) => {
      // Error occurred
      switch (reason.code) {
        case "auth/user-not-found":
          errorMessage.value = "Couldn't find your account.";
          break;
        case "auth/wrong-password":
          errorMessage.value =
            "Wrong password. Try again or click 'Forgotten your password?' to reset it.";
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
