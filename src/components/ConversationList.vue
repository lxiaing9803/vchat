<template>
  <div class="conversation-list">
    <div v-for="item in items" :key="item.id" @click="handleNavigate(item.id)"
      class="item border-gray-300 border-t cursor-pointer bg-white hover:bg-gray-200 p-2">
      <div class="flex justify-between items-center text-sm leading-5 text-gray-500">
        <span>{{ item.selectedModel }}</span>
        <span>{{ item.updatedAt }}</span>
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

const router = useRouter()
const handleNavigate = (id: number) => {
  router.push(`/conversation/${id}`)
}

defineProps<{
  items: ConversationProps[]
}>()
</script>
