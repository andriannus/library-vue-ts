<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <h1 class="display-1 text-xs-center">Welcome to Library App Admin</h1>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  metaInfo: {
    title: 'Home',
  },
})
export default class HomeAdmin extends Vue {}
</script>
