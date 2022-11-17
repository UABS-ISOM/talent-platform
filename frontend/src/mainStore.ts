import type { ParsedToken } from "firebase/auth";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore("main", () => {
  const userLoaded = ref(false);
  const userClaims = ref<ParsedToken | undefined>(undefined);

  return { userLoaded, userClaims };
});
