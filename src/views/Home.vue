<template>
  <div class="bg-white h-full flex-1 flex items-center">
    <div class="w-[80%] mx-auto h-full">
      <div class="flex items-center h-[85%]">
        <ProviderSelect :items="providers" v-model="currentProvider" />
      </div>
      <div class="flex items-center h-[15%]">
        <MessageInput
          @create="createConversation"
          :disabled="!currentProvider"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProviderSelect from "@/components/ProviderSelect.vue"
import MessageInput from "@/components/MessageInput.vue"
import { computed, onMounted, ref } from "vue"
import { db } from "@/db"
import { useRouter } from "vue-router"
import { useConversationStore } from "@/stores/conversation"
import { useProviderStore } from "@/stores/provider"

const navigate = useRouter()

const currentProvider = ref<any>("")
const providerStore = useProviderStore()

const conversationStore = useConversationStore()

const providers = computed(() => providerStore.items)

onMounted(async () => {
  await providerStore.fetchProviders()
})

const modelInfo = computed(() => {
  const [providerId, selectedModel] = currentProvider.value.split("/")
  return {
    providerId: parseInt(providerId),
    selectedModel,
  }
})

const createConversation = async (question: string, imagePath?: string) => {
  const { providerId, selectedModel } = modelInfo.value
  const currentDate = new Date().toISOString()
  let copiedImagePath: string | undefined
  if (imagePath) {
    try {
      copiedImagePath = await window.electronAPI.copyImageToUserDir(imagePath)
    } catch (error) {
      console.error("Failed to copy image to user directory:", error)
    }
  }
  const conversationId = await conversationStore.createConversation({
    title: question,
    providerId,
    selectedModel,
    createdAt: currentDate,
    updatedAt: currentDate,
  })
  const newMessageId = await db.messages.add({
    conversationId,
    content: question,
    createdAt: currentDate,
    updatedAt: currentDate,
    type: "question",
    ...(copiedImagePath && { imagePath: copiedImagePath }),
  })
  navigate.push(`/conversation/${conversationId}?init=${newMessageId}`)
}
</script>

<style scoped></style>
