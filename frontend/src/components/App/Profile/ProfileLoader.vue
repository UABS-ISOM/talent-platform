<template>
  <div class="col-12 col-md-4 col-lg-3 q-pa-sm">
    <q-card flat bordered dark class="bg-secondary text-center">
      <q-card-section>
        <q-avatar
          size="140px"
          style="max-width: 100%"
          class="flex justify-center q-mx-auto"
        >
          <q-skeleton type="circle" size="100%" animation="fade" />
        </q-avatar>

        <div class="q-pa-sm">
          <q-skeleton type="text" animation="fade" />

          <q-skeleton type="text" animation="fade" />
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div class="col-12 col-md-8 col-lg-9 q-pa-sm">
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between q-mb-sm">
          <q-skeleton type="text" width="100px" animation="fade" />

          <q-skeleton type="circle" size="42px" animation="fade" />
        </div>

        <q-skeleton v-for="i in 3" :key="i" type="text" animation="fade" />
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between q-mb-sm">
          <q-skeleton type="text" width="100px" animation="fade" />

          <q-skeleton type="circle" size="42px" animation="fade" />
        </div>

        <div class="row q-gutter-sm q-mb-sm">
          <q-skeleton v-for="i in 3" :key="i" type="QChip" animation="fade" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
