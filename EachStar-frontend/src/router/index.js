import { createRouter, createWebHashHistory } from 'vue-router'
import { isMobile } from '@/lib/client.js'

const router = createRouter({
  mode: 'hash',
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'desktop',
      component: () => import('@/views/desktop.vue'),
    },
    {
      path: '/mobile',
      name: 'mobile',
      component: () => import('@/views/mobile.vue'),
    },
  ],
})

/**
 * 前置守卫
 */
router.beforeEach((to, from, next) => {
  if (isMobile()) {
    if (to.path != '/mobile') {
      router.replace('/mobile')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
