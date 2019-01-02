import Vue from 'vue';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import VeeValidate from 'vee-validate';
import axios from 'axios';
import Meta from 'vue-meta';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Vuetify);
Vue.use(VueAxios, axios);
Vue.use(VeeValidate);
Vue.use(Meta);

const token = localStorage.getItem('t-t');
if (token) {
  axios.defaults.headers.common['t-t'] = token;
}

axios.defaults.baseURL = 'http://localhost:7777/api/v1/';
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
