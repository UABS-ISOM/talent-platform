<template>
  <AuthCard>
    <div class="q-py-sm">
      <AuthHeader>Verify your email address</AuthHeader>

      <q-spinner-dots
        v-if="loading"
        color="primary"
        size="xl"
        aria-label="Loading"
        class="block q-mx-auto q-my-sm"
      />

      <GenericAlert v-model="success" type="success" class="q-py-sm" static>
        Email address successfully verified.
      </GenericAlert>

      <GenericAlert v-model="error" type="error" class="q-py-sm" static>
        {{ errorMessage }}
      </GenericAlert>
    </div>
  </AuthCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GENERIC_ERROR } from "@/helpers";
import AuthCard from "@/components/Auth/AuthCard.vue";
import AuthHeader from "@/components/Auth/AuthHeader.vue";
import GenericAlert from "@/components/GenericAlert.vue";
import { getAuth, applyActionCode } from "firebase/auth";
import { useRoute } from "vue-router";
import { generateClaims } from "@/firebase";

// Status
const success = ref(false);
const error = ref(false);
const errorMessage = ref("");
const loading = ref(true);

// Execute the action on mount
onMounted(() => {
  // Get the action code from the URL
  const actionCode = useRoute().query.oobCode as string;

  // Verify the action code
  const auth = getAuth();
  applyActionCode(auth, actionCode)
    .then(async () => {
      // Email verified
      success.value = true;
      await auth.currentUser?.reload();
      generateClaims();
    })
    .catch((reason) => {
      // Error occurred
      switch (reason.code) {
        case "auth/invalid-action-code":
          errorMessage.value = `This link is invalid.${
            auth.currentUser !== undefined && auth.currentUser?.emailVerified
              ? ` The currently signed-in user, ${auth.currentUser.email}, is already verified.`
              : ""
          }`;
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
});
</script>
