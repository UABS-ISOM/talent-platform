<template>
  <q-page class="row content-start">
    <div class="row col-12 col-sm-10 col-xl-8 q-pa-sm q-mx-auto">
      <div class="col-12 col-sm-5 col-md-4 col-lg-3 q-pa-sm">
        <q-card flat bordered dark class="bg-secondary text-center">
          <q-card-section>
            <q-avatar
              size="140px"
              style="max-width: 100%"
              class="flex justify-center q-mx-auto"
            >
              <img
                src="https://cdn.quasar.dev/img/avatar.png"
                style="max-width: 100%"
                class="q-pa-sm"
              />
            </q-avatar>

            <div class="q-pa-sm">
              <h2 class="text-h6 q-my-none q-mb-sm">
                Anonymous Mouse
                <span class="text-weight-regular text-grey-5">she/her</span>
              </h2>

              <div class="text-subtitle1 q-mb-sm">Staff</div>

              <q-chip :ripple="false">ENGGEN 204</q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-7 col-md-8 col-lg-9 q-pa-sm">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="q-pb-none">
            <h2 class="text-h6 q-my-none q-mb-sm">About me</h2>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              sollicitudin magna eu neque imperdiet laoreet. Suspendisse sem
              diam, interdum nec velit id, molestie efficitur turpis. Sed ac
              congue ligula. Nunc hendrerit arcu sed pulvinar pellentesque.
              Vivamus lorem sapien, aliquet quis est eget, tincidunt sagittis
              enim. Nullam ultricies sapien arcu, ac ultricies diam hendrerit
              sed. Donec a pharetra diam. Etiam et pellentesque justo, non
              bibendum risus. Proin et sapien eros. Pellentesque porttitor
              semper ipsum et aliquam. Cras lacus neque, condimentum in metus
              non, hendrerit vulputate risus. In interdum a quam vel vehicula.
              Maecenas tristique risus non venenatis lobortis. Morbi vel ipsum
              orci. Fusce purus sem, pretium elementum urna a, efficitur
              porttitor turpis. Vestibulum malesuada sem nunc, sed accumsan arcu
              sollicitudin et.
            </p>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <h2 class="text-h6 q-my-none q-mb-sm">Skills</h2>

            <q-chip :ripple="false">Business management</q-chip>
            <q-chip :ripple="false">Software development</q-chip>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <h2 class="text-h6 q-my-none q-mb-sm">Experience</h2>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
