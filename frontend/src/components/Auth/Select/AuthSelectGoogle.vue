<template>
  <div class="q-py-sm">
    <div class="q-py-sm">
      <q-btn
        no-caps
        unelevated
        :loading="loading"
        color="google"
        class="full-width"
        icon="mdi-google"
        label="Continue with Google"
        @click="openGooglePopup"
      />
    </div>

    <GenericAlert v-model="error" type="error" class="q-py-sm">
      {{ errorMessage }}
    </GenericAlert>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GENERIC_ERROR } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Button status
const error = ref(false);
const errorMessage = ref("");
const loading = ref(false);

// Google provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  login_hint: "jsmi123@aucklanduni.ac.nz",
});

const openGooglePopup = () => {
  error.value = false;
  loading.value = true;

  const auth = getAuth();
  signInWithPopup(auth, provider)
    .catch((reason) => {
      // An error occurred
      switch (reason.code) {
        case "auth/popup-closed-by-user":
          return;
        default:
          errorMessage.value = GENERIC_ERROR;
      }

      if (reason.code !== "auth/cancelled-popup-request") error.value = true;
    })
    .finally(() => {
      // Catch all
      loading.value = false;
    });
};
</script>
