<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Pending Projects</h2>
  </div>

  <p class="q-pa-sm q-mb-none">
    Here you can approve projects that industry representatives have asked to be
    displayed to students.
  </p>

  <div class="q-pa-sm">
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem,
              eius reprehenderit eos corrupti commodi magni quaerat ex numquam,
              dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </p>

            <div class="row justify-end">
              <q-btn
                no-caps
                unelevated
                type="submit"
                color="red"
                icon="mdi-close"
                label="Deny"
                class="q-mr-sm"
              />

              <q-btn
                no-caps
                unelevated
                type="submit"
                color="green"
                icon="mdi-check"
                label="Approve"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
