<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Browse Projects</h2>
  </div>

  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="browse" label="Browse Projects" no-caps />
    <q-tab name="starred" label="Starred Projects" no-caps />
    <q-tab name="bids" label="Projects with Bids" no-caps />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="browse" class="q-pa-sm">
      <div class="text-h6">Browse Projects</div>
      <p>
        Here you can browse projects available to make bids on for this course.
      </p>

      <q-list>
        <q-expansion-item
          popup
          default-opened
          label="Embedded System"
          caption="Submitted by Bill Gates"
        >
          <q-separator />
          <q-card>
            <q-card-section>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </p>

              <div class="row justify-end">
                <q-btn
                  no-caps
                  unelevated
                  flat
                  type="submit"
                  :color="starred ? 'warning' : 'black'"
                  icon="mdi-star"
                  :label="starred ? 'Unstar' : 'Star'"
                  class="q-mr-sm"
                  @click="starred = !starred"
                />

                <q-btn
                  no-caps
                  unelevated
                  type="submit"
                  color="primary"
                  icon="mdi-plus"
                  label="Create bid"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-tab-panel>

    <q-tab-panel name="starred" class="q-pa-sm">
      <div class="text-h6">Starred Projects</div>
      <p>These are the projects members of your group have starred.</p>

      <GenericNone> Your group hasn't starred any projects yet. </GenericNone>
    </q-tab-panel>

    <q-tab-panel name="bids" class="q-pa-sm">
      <div class="text-h6">Projects with Bids</div>
      <p>These are the projects your group has written bids for.</p>

      <GenericNone> Your group hasn't started any bids yet. </GenericNone>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
import GenericNone from "@/components/GenericNone.vue";
import { ref } from "vue";

const tab = ref("browse");
const starred = ref(false);
</script>
