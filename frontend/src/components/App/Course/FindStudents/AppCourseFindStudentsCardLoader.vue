<template>
  <div class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3 text-black">
    <q-card flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-skeleton type="circle" size="40px" animation="fade" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-skeleton type="text" animation="fade" />
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section>
        <q-skeleton v-for="i in 3" :key="i" type="text" animation="fade" />
      </q-card-section>
    </q-card>
  </div>
</template>
