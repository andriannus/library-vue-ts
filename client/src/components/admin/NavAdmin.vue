<template>
  <div>
    <v-toolbar app fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y>
          <v-btn
            flat
            slot="activator"
          >
            <v-icon>mdi-settings</v-icon>
          </v-btn>
          
          <v-list>
            <v-list-tile to="/logout" @click="logOut()">
              <v-list-tile-action>
                <v-icon>mdi-logout-variant</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                Logout
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer
      app
      temporary
      v-model="drawer"
      width="250"
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Library
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-tile exact to="/admin" @click="setTitle">
          <v-list-tile-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Home
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/admin/book" @click="setTitle">
          <v-list-tile-action>
            <v-icon>mdi-book</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Books
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component,  Vue } from 'vue-property-decorator';

@Component
export default class Navigation extends Vue {
  public drawer = false;
  public title = '';

  private mounted() {
    this.setTitle();
  }

  private setTitle() {
    this.title = this.$route.meta.title;
  }

  private logOut() {
    // Vuex Action
    this.$store.dispatch('AUTH_LOGOUT')
      .then(() => {
        this.$router.push('/login');
      });
  }
}
</script>
