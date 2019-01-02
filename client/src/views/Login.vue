<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-form @submit.prevent="validateForm()">
          <v-card>
            <v-card-title>
              <h3 class="title">Login</h3>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    label="E-mail"
                    v-model="user.email"
                    v-validate="'required|email'"
                    data-vv-name="email"
                    :error-messages="errors.collect('email')"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Password"
                    :type="pass ? 'password' : 'text'"
                    v-model="user.password"
                    v-validate="'required'"
                    data-vv-name="password"
                    :append-icon="pass ? 'visibility' : 'visibility_off'"
                    @click:append="changeVisibility"
                    :error-messages="errors.collect('password')"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions v-show="!isLoading">
              <v-btn flat to="/register">Register</v-btn>
              <v-spacer></v-spacer>

              <v-btn flat color="info" type="submit">Submit</v-btn>
              <v-btn flat @click="reset()">Cancel</v-btn>
            </v-card-actions>

            <v-card-actions v-show="isLoading">
              <v-spacer></v-spacer>
              <v-btn flat disabled>Please Wait...</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>

    <v-snackbar
      bottom
      right
      :timeout="2000"
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  metaInfo: {
    title: 'Login',
  },

  $_veeValidate: {
    validator: 'new',
  },
})

export default class Login extends Vue {
  private snackbarText = '';
  private pass = true;
  private isLoading = false;
  private snackbar = false;
  private user = {
    email: '',
    password: '',
  };
  private dictionary = {
    custom: {
      email: {
        required: 'E-mail can not be empty',
        email: 'Must be a valid e-mail',
      },
      password: {
        required: 'Password can not be empty',
      },
    },
  };

  private mounted() {
    this.$validator.localize('en', this.dictionary);
  }

  private changeVisibility() {
    this.pass = !this.pass;
  }

  private validateForm() {
    this.$validator.validateAll()
      .then((result) => {
        if (!result) {
          return;
        }

        this.loginProcess();
      });
  }

  private loginProcess() {
    this.isLoading = true;
    const user = this.user;

    this.$store.dispatch('AUTH_REQUEST', user)
      .then(() => {
        this.isLoading = false;

        if (this.$store.getters.isAdmin) {
          this.$router.push('/admin');
        } else {
          this.$router.push('/');
        }
      })
      .catch((err) => {
        this.isLoading = false;
        this.snackbarText = err.message;
        this.snackbar = true;

        if (err.code === 404) {
          this.reset();
        }

        if (err.code === 401) {
          this.user.password = '';
        }

        this.$validator.reset();
      });
  }

  private reset() {
    this.user.email = '';
    this.user.password = '';
    this.$validator.reset();
  }
}
</script>
