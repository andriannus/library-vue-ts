<template>
  <div>
    <NavAdmin />

    <v-content>
      <router-view />
    </v-content>

    <v-footer app absolute py-3>
      <v-layout justify-center row wrap>
        <v-flex text-xs-center>
          &copy; 2018 - Library App with Vue
        </v-flex>
      </v-layout>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import NavAdmin from '@/components/admin/NavAdmin.vue';

@Component({
  metaInfo: {
    titleTemplate: '%s - Library App Vue',
  },

  components: {
    NavAdmin,
  },
})

export default class LayoutAdmin extends Vue {}
</script>
