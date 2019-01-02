import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

axios.defaults.baseURL = 'http://localhost:8081/api/v1/';

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('t-t') || '',
    user: JSON.parse(localStorage.getItem('u-d') || '{}'),
    status: '',
  },

  mutations: {
    AUTH_REQUEST: (state) => {
      state.status = 'loading';
    },

    AUTH_SUCCESS: (state, token) => {
      state.status = 'success';
      state.token = token;
    },

    AUTH_ERROR: (state) => {
      state.status = 'error';
    },

    AUTH_LOGOUT: (state) => {
      state.token = '';
      state.user = '';
      state.status = '';
    },

    USER_DATA: (state, user) => {
      state.user = user;
    },
  },

  actions: {
    AUTH_REQUEST: ({commit}, userData) => {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST');
        axios.post('auth/login', userData)
          .then((res) => {
            let err;

            if (res.data.status === 404) {
              err = {
                code: 404,
                message: 'User not found',
              },
              reject(err);
            }

            if (res.data.status === 401) {
              err = {
                code: 401,
                message: 'Password does not match',
              },
              reject(err);
            }

            if (res.data.status === 200) {
              const token = res.data.token;
              const user = JSON.stringify(res.data.user);

              localStorage.setItem('t-t', token);
              localStorage.setItem('u-d', user);

              axios.defaults.headers.common['t-t'] = token;

              commit('AUTH_SUCCESS', token);
              commit('USER_DATA', res.data.user);
              resolve(res);
            }
          })
          .catch((err) => {
            localStorage.removeItem('t-t');
            reject(err);
          });
      });
    },

    AUTH_REFRESH: ({commit}, id) => {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST');
        axios.post('auth/refreshToken', id)
          .then((res) => {
            let err;

            if (res.data.status === 404) {
              err = {
                code: 404,
                message: 'User not found',
              },
              reject(err);
            }

            if (res.data.status === 200) {
              const token = res.data.token;
              const user = JSON.stringify(res.data.user);

              localStorage.setItem('t-t', token);
              localStorage.setItem('u-d', user);

              axios.defaults.headers.common['t-t'] = token;

              commit('AUTH_SUCCESS', token);
              commit('USER_DATA', res.data.user);
              resolve(res);
            }
          })
          .catch((err) => {
            localStorage.removeItem('t-t');
            reject(err);
          });
      });
    },

    AUTH_LOGOUT: ({commit}) => {
      return new Promise((resolve) => {
        commit('AUTH_LOGOUT');

        localStorage.removeItem('t-t');
        localStorage.removeItem('u-d');

        delete axios.defaults.headers.common['t-t'];
        resolve();
      });
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => !!state.token && state.user.level === 'admin',
    isUser: (state) => !!state.token && state.user.level === 'user',
    authStatus: (state) => state.status,
  },
});
