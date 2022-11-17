<template>
  <AuthCard>
    <div class="q-py-sm">
      <AuthHeader>Verify your email address</AuthHeader>

      <GenericAlert v-model="success" type="success" class="q-py-sm" static>
        Email address successfully verified.
      </GenericAlert>

      <GenericAlert v-model="error" type="error" class="q-py-sm" static>
        {{ GENERIC_ERROR }} Otherwise, your link could be invalid.
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
const loading = ref(false);

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
    .catch(() => {
      // Error occurred
      error.value = true;
    })
    .finally(() => {
      // Catch all
      loading.value = false;
    });
});
</script>
