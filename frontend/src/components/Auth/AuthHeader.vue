<template>
  <div class="flex no-wrap items-center">
    <q-btn
      flat
      round
      color="primary"
      icon="mdi-arrow-left"
      class="q-mr-lg"
      :to="{ name: 'Auth' }"
    />

    <div class="text-h4 q-py-sm"><slot /></div>
  </div>
</template>
