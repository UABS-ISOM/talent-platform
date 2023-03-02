<template>
  <router-link
    :to="{ name: 'AppCourseFindStudents', params: { courseId: id } }"
    class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3 text-black"
    style="text-decoration: none"
  >
    <q-card flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="photoUrl" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <h2 class="text-h6 q-my-none">{{ name }}</h2>
        </q-item-section>

        <q-item-section side>
          <q-btn flat round dense icon="mdi-chat" @click.prevent>
            <q-menu>
              <q-list style="min-width: 100px; max-width: 200px">
                <q-item
                  v-close-popup
                  clickable
                  @click="getPersonalChatOptions.enabled = true"
                >
                  <q-item-section avatar>
                    <q-icon name="mdi-account" />
                  </q-item-section>

                  <q-item-section>Open chat</q-item-section>
                </q-item>

                <q-item
                  v-close-popup
                  clickable
                  @click="showAddToChatDialog = true"
                >
                  <q-item-section avatar>
                    <q-icon name="mdi-account-multiple" />
                  </q-item-section>

                  <q-item-section>Add to group chat</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>

      <CustomDialog
        v-model="showAddToChatDialog"
        :title="`Add ${name} to chat`"
      >
        <AppCourseFindStudentsAddToChat
          :course-id="(courseId as string)"
          :user-id="id"
          :name="name"
          @close="showAddToChatDialog = false"
        />
      </CustomDialog>

      <q-separator />

      <q-card-section v-if="overview === ''" class="text-grey-6">
        This user hasn't set an overview.
      </q-card-section>

      <q-card-section v-else>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="truncated-paragraph q-mb-none" v-html="overview" />
      </q-card-section>

      <div
        v-if="skills.length > 0"
        class="flex q-px-md q-pb-md"
        style="gap: 8px"
      >
        <q-chip
          v-for="(skill, index) in skills"
          :key="index"
          :ripple="false"
          class="q-ma-none"
        >
          {{ skill }}
        </q-chip>
      </div>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { graphql } from "@/gql/__generated__";
import { useQuery } from "@vue/apollo-composable";
import router from "@/router";
import CustomDialog from "@/components/CustomDialog.vue";
import AppCourseFindStudentsAddToChat from "./AppCourseFindStudentsAddToChat.vue";

const showAddToChatDialog = ref(false);

const {
  params: { courseId },
} = useRoute() as unknown as { params: { courseId: string } };

const props = defineProps<{
  id: string;
  photoUrl: string;
  name: string;
  overview: string;
  skills: string[];
}>();

// Query to get the chat between two people
const getPersonalChatOptions = ref({
  enabled: false,
});

const { result: personalChat } = useQuery(
  graphql(`
    query getCoursePersonalChat($courseId: ID!, $otherUid: String!) {
      coursePersonalChat(courseId: $courseId, otherUid: $otherUid) {
        id
      }
    }
  `),
  { courseId: courseId, otherUid: props.id },
  getPersonalChatOptions
);

// Go to personal chat if query returns a chat
watch(personalChat, (v) => {
  if (v?.coursePersonalChat?.id)
    router.push({
      name: "AppCourseChat",
      params: { courseId: courseId, chatId: v.coursePersonalChat.id },
    });
});
</script>

<style scoped>
.truncated-paragraph {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
