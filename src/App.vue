<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto scrollbar-hide">
        <ConversationList :items="conversations" />
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2 items-center">
        <Button @click="handleNavigate('/')" iconName="radix-icons:chat-bubble">
          新建对话
        </Button>
        <Button plain @click="handleNavigate('/setting')" iconName="radix-icons:gear">
          应用设置
        </Button>
      </div>
    </div>
    <div class="h-full flex-1 ">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import ConversationList from "./components/ConversationList.vue";
import { useRouter } from "vue-router";
import { db, initProviders } from './db'
import Button from "./components/Button.vue";
import { onMounted, ref } from "vue";
import { ConversationProps } from "./types";

const router = useRouter()

const conversations = ref<ConversationProps[]>([])

const handleNavigate = (path: string) => {
  router.push(path)
}

onMounted(async () => {
  await initProviders()
  conversations.value = await db.conversations.toArray()
})

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite',
);
</script>

<style scoped></style>
