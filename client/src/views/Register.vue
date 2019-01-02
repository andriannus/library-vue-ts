<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-form @submit.prevent="validateForm()">
          <v-card>
            <v-card-title>
              <h3 class="title">Register</h3>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Name"
                    v-model="user.name"
                    v-validate="'required|alpha'"
                    data-vv-name="name"
                    :error-messages="errors.collect('name')"
                  ></v-text-field>
                </v-flex>
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
                    label="Username"
                    v-model="user.username"
                    v-validate="'required|min:8'"
                    data-vv-name="username"
                    :error-messages="errors.collect('username')"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Password"
                    type="password"
                    v-model.number="user.password"
                    v-validate="'required|min:8'"
                    data-vv-name="password"
                    :error-messages="errors.collect('password')"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions v-show="!isLoading">
              <v-btn flat to="/login">Login</v-btn>
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
import lodash from 'lodash';

@Component({
  metaInfo: {
    title: 'Register',
  },

  $_veeValidate: {
    validator: 'new',
  },
})

export default class Register extends Vue {
  private snackbarText = '';
  private isLoading = false;
  private snackbar = false;
  private user = {
    name: '',
    email: '',
    username: '',
    password: '',
  };
  private dictionary = {
    custom: {
      name: {
        required: 'Name can not be empty',
        alpha: 'Only contain alphabetic characters',
      },
      email: {
        required: 'E-mail can not be empty',
        email: 'Must be a valid e-mail',
      },
      username: {
        required: 'Username can not be empty',
        min: 'Must be at least 8 characters',
      },
      password: {
        required: 'Password can not be empty',
        min: 'Must be at least 8 characters',
      },
    },
  };

  private mounted() {
    this.$validator.localize('en', this.dictionary);
  }

  private async validateForm() {
    const result = await this.$validator.validateAll();
    const isUsedEmail = await this.checkEmail();
    const isUsedUsername = await this.checkUsername();

    if (!result) {
      return;
    }

    if (!isUsedEmail) {
      this.snackbarText = 'E-mail has been used';
      this.snackbar = true;
      return;
    }

    if (!isUsedUsername) {
      this.snackbarText = 'Username has been used';
      this.snackbar = true;
      return;
    }

    this.saveData();
  }

  private checkEmail() {
    const { email } = this.user;

    return this.axios.post('auth/checkEmail', { email })
      .then((res) => {
        if (!res.data.success) {
          return false;
        } else {
          return true;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  private checkUsername() {
    const { username } = this.user;

    return this.axios.post('auth/checkUsername', { username })
      .then((res) => {
        if (!res.data.success) {
          return false;
        } else {
          return true;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  private saveData() {
    this.isLoading = true;

    const user = this.user;

    this.axios.post('auth/register', user)
      .then((res) => {
        this.isLoading = false;
        this.$router.push('/login');
      })
      .catch((err) => {
        this.isLoading = false;
        // console.log(err);
      });
  }

  private reset() {
    this.user.name = '';
    this.user.email = '';
    this.user.username = '';
    this.user.password = '';

    this.$validator.reset();
  }
}
</script>
