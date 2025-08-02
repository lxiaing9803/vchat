<template>
  <div class="conversation-list">
    <div v-for="item in items" :key="item.id" @click="handleNavigate(item.id)"
      class="item border-gray-300 border-t cursor-pointer  p-2" :class="{
        'bg-gray-100 hover:bg-gray-300': conversationStore.selectedId === item.id,
        'bg-white hover:bg-gray-200': conversationStore.selectedId !== item.id
      }">
      <div class="flex justify-between items-center text-sm leading-5 text-gray-500">
        <span>{{ item.selectedModel }}</span>
        <span>{{ dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </div>
      <h2 class="font-semibold leading-6 text-gray-900 truncate">
        {{ item.title }}
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ConversationProps } from "@/types"
import { useRouter } from "vue-router"
import { useConversationStore } from "@/stores/conversation"
import dayjs from "dayjs"

const router = useRouter()
const conversationStore = useConversationStore()
const handleNavigate = (id: number) => {
  conversationStore.selectedId = id
  router.push(`/conversation/${id}`)
}

defineProps<{
  items: ConversationProps[]
}>()
</script>
