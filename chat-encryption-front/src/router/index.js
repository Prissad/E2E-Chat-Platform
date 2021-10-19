import Vue from 'vue'
import VueRouter from 'vue-router'
import Users from "@/views/Users"
import Chat from "@/views/Chat";

Vue.use(VueRouter)

const routes = [
  {
    path: '/register',
    name: 'register',
    component: () => import( '../views/register.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( '../views/login.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
