import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/home.vue';
import Login from '../components/login.vue';
import Register from '../components/register.vue';
import List from '../components/list.vue';
import Add from '../components/addProduct.vue';
import Detail from '../components/detail.vue';
import Update from '../components/updateProduct.vue';
import Profile from '../components/profile.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/list',
    name: 'list',
    component: List
  },
  {
    path: '/add',
    name: 'add',
    component: Add
  },
  {
    path: '/detail',
    name: 'detail',
    component: Detail
  },
  {
    path: '/update',
    name: 'update',
    component: Update
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
