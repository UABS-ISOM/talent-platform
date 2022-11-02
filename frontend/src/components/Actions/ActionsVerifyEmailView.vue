<template>
  <AuthCard>
    <div class="q-py-sm">
      <AuthHeader>Verify your email address</AuthHeader>

      <div>
        <GenericAlert v-model="success" type="success" class="q-py-sm">
          Email address successfully verified.
        </GenericAlert>

        <GenericAlert v-model="error" type="error" class="q-py-sm">
          {{ errorMessage }} Otherwise, your link could be invalid.
        </GenericAlert>
      </div>
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

// Status
const success = ref(false);
const error = ref(false);
const errorMessage = ref("");
const loading = ref(false);

onMounted(() => {
  // Get the action code from the URL
  const actionCode = useRoute().query.oobCode as string;

  // Verify the action code
  const auth = getAuth();
  applyActionCode(auth, actionCode)
    .then(() => {
      // Email verified
      success.value = true;
      auth.currentUser?.reload();
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
});
</script>
