import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/account',
    alwayShow: true,
    meta: { title: 'message.menu.user.name', icon: 'iconfont icon-center' },
    children: [
      {
        path: 'user',
        component: createNameComponent(() => import('@/views/main/user/user/index.vue')),
        meta: { title: 'message.menu.user.user', icon: 'iconfont icon-user' }
      },
    ]
  }
]

export default route