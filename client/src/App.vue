<template>
  <v-app class="grey lighten-2">
    <router-view />
  </v-app>
</template>

<script lang="ts">
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>
