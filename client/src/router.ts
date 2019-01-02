import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import Register from './views/Register.vue';
import Login from './views/Login.vue';
import LayoutAdmin from './views/admin/LayoutAdmin.vue';
import LayoutUser from './views/user/LayoutUser.vue';
import HomeAdmin from './views/admin/HomeAdmin.vue';
import HomeUser from './views/user/HomeUser.vue';
import BookAdmin from './views/admin/BookAdmin.vue';
import BookUser from './views/user/BookUser.vue';
import ProfileUser from './views/user/ProfileUser.vue';

Vue.use(Router);

const ifNotAuthenticated = (to: any, from: any, next: any) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }

  next('/');
};

const ifAuthenticated = (to: any, from: any, next: any) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }

  next('/login');
};

const ifAdmin = (to: any, from: any, next: any) => {
  if (store.getters.isAdmin) {
    next();
    return;
  }

  next('/login');
};

const ifUser = (to: any, from: any, next: any) => {
  if (store.getters.ifUser) {
    next();
    return;
  }

  next('/login');
};

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter: ifNotAuthenticated,
      meta: {
        title: 'Register',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: ifNotAuthenticated,
      meta: {
        title: 'Login',
      },
    },
    {
      path: '/admin',
      component: LayoutAdmin,
      beforeEnter: ifAdmin,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeAdmin,
          meta: {
            title: 'Dashboard',
          },
        },
        {
          path: 'book',
          name: 'list-books',
          component: BookAdmin,
          meta: {
            title: 'List of Books',
          },
        },
      ],
    },
    {
      path: '/',
      component: LayoutUser,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: '',
          name: 'home-user',
          component: HomeUser,
          meta: {
            title: 'Home',
          },
        },
        {
          path: 'book',
          name: 'book-user',
          component: BookUser,
          meta: {
            title: 'List of Books',
          },
        },
        {
          path: 'profile',
          name: 'profile-user',
          component: ProfileUser,
          meta: {
            title: 'Profile User',
          },
        },
      ],
    },
  ],
});
