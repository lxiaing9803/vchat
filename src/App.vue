<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 w-[300px] h-full border-r border-gray-300">
      <ConversationList :items="items" />
    </div>
    <div class="bg-green-300 text-blue-700 h-full flex-1">
      content
      <input
        type="text"
        placeholder="Search for anything"
        class="placeholder:text-blue-300"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ConversationProps } from "./types"
import ConversationList from "./components/ConversationList.vue"

const items: ConversationProps[] = [
  {
    id: 1,
    selectedModel: "GPT-3.5-Turbo",
    title: "什么是光合作用1",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    providerId: "1",
  },
  {
    id: 2,
    selectedModel: "GPT-3.5-Turbo",
    title: "什么是光合作用2",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    providerId: "1",
  },
  {
    id: 3,
    selectedModel: "GPT-3.5-Turbo",
    title: "什么是光合作用3",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    providerId: "1",
  },
  {
    id: 4,
    selectedModel: "GPT-3.5-Turbo",
    title: "什么是光合作用4,什么是光合作用4,什么是光合作用4",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    providerId: "1",
  },
]
console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
)
</script>

<style scoped></style>
