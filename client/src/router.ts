import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

const Register = () => import('./views/Register.vue');
const Login = () => import('./views/Login.vue');
const LayoutAdmin = () => import('./views/admin/LayoutAdmin.vue');
const LayoutUser = () => import('./views/user/LayoutUser.vue');
const HomeAdmin = () => import('./views/admin/HomeAdmin.vue');
const HomeUser = () => import('./views/user/HomeUser.vue');
const BookAdmin = () => import('./views/admin/BookAdmin.vue');
const BookUser = () => import('./views/user/BookUser.vue');
const ProfileUser = () => import('./views/user/ProfileUser.vue');

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
