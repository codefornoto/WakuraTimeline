import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import("../views/UploadView.vue"),
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import("../views/EditView.vue"),
    },
  ],
})

export default router
