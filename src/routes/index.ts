import { createRouter, createMemoryHistory, RouteRecordRaw } from "vue-router"
import Home from "@/views/Home.vue"
import Conversation from "@/views/Conversation.vue"
import Setting from "@/views/Setting.vue"

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/conversation/:id", component: Conversation },
  { path: "/setting", component: Setting },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
