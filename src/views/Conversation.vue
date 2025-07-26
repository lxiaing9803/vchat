<template>
    <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between">
        <h3 class="font-semibold text-gray-900 text-lg">{{ conversation?.title }}</h3>
        <span class="text-gray-500 text-sm">{{ conversation?.createdAt }}</span>
    </div>
    <div class="w-[80%] mx-auto h-[75%] overflow-y-auto scrollbar-hide pt-2">
        <MessageList :messages="filteredMessages" />
    </div>
    <div class="w-[80%] mx-auto h-[15%] flex items-center ">
        <MessageInput />
    </div>
</template>

<script setup lang="ts">
import MessageInput from '@/components/MessageInput.vue'
import MessageList from '@/components/MessageList.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { conversations, messages } from '@/testData'
import { ConversationProps, MessageProps } from '@/types'

const route = useRoute()
const filteredMessages = ref<MessageProps[]>([])
const conversation = ref<ConversationProps>()

const dealPage = (id: number) => {
    filteredMessages.value = messages.filter((message) => message.conversationId === id)
    conversation.value = conversations.find(c => c.id === id)
}

onMounted(() => {
    const id = route.params.id as string
    dealPage(+id)
})

watch(() => route.params.id, (newId: string) => {
    dealPage(+newId)
})

</script>
