<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto scrollbar-hide">
        <ConversationList :items="items" />
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2 items-center">
        <Button @click="handleNavigate('/')" iconName="radix-icons:chat-bubble">
          {{ t("common.newChat") }}
        </Button>
        <Button
          plain
          @click="handleNavigate('/setting')"
          iconName="radix-icons:gear"
        >
          {{ t("common.settings") }}
        </Button>
      </div>
    </div>
    <div class="h-full flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import ConversationList from "./components/ConversationList.vue"
import { useRouter } from "vue-router"
import { useConversationStore } from "./stores/conversation"
import { initProviders } from "./db"
import Button from "./components/Button.vue"
import { computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useProviderStore } from "./stores/provider"
import { initI18n } from "./i18n"

const { t } = useI18n()

const router = useRouter()

const conversationStore = useConversationStore()

const items = computed(() => conversationStore.items)

const providerStore = useProviderStore()

const handleNavigate = (path: string) => {
  router.push(path)
}

// 监听菜单事件
window.electronAPI.onMenuNewConversation(() => {
  router.push("/")
})

window.electronAPI.onMenuOpenSettings(() => {
  router.push("/settings")
})

onMounted(async () => {
  await initI18n()
  await initProviders()
  conversationStore.fetchConversations()
  providerStore.fetchProviders()
})
</script>

<style scoped></style>
