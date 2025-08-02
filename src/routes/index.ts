import { createRouter, createMemoryHistory, RouteRecordRaw } from "vue-router"
import Home from "../views/Home.vue"
import Conversation from "../views/Conversation.vue"
import Setting from "../views/Setting.vue"
import { useConversationStore } from "../stores/conversation"

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/conversation/:id", component: Conversation },
  { path: "/setting", component: Setting },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const conversationStore = useConversationStore()
  if (!to.path.startsWith("/conversation")) {
    conversationStore.selectedId = -1
  }
  next()
})

export default router
