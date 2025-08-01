<template>
    <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between">
        <h3 class="font-semibold text-gray-900 text-lg">{{ conversation?.title }}</h3>
        <span class="text-gray-500 text-sm">{{ dayjs(conversation?.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
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
import { ConversationProps, MessageProps, MessageStatus } from '@/types'
import { db } from '@/db'
import dayjs from 'dayjs'

const route = useRoute()
const filteredMessages = ref<MessageProps[]>([])
const conversation = ref<ConversationProps>()
const conversationId = parseInt(route.params.id as string)
const initMessageId = parseInt(route.query.init as string)
const lastQuestion = ref<string>('')

const dealPage = async (id: number) => {
    filteredMessages.value = await db.messages.where({ conversationId: id }).toArray()
    conversation.value = await db.conversations.where({ id }).first()
}
const createInitialMessage = async () => {
    const createdData: Omit<MessageProps, 'id'> = {
        content: '',
        conversationId,
        type: 'answer',
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        status: 'loading'
    }
    const newMessageId = await db.messages.add(createdData)
    filteredMessages.value.push({
        ...createdData,
        id: newMessageId,
    })
    if (conversation.value) {
        const provider = await db.providers.where({ id: conversation.value.providerId }).first()
        if (provider) {
            await window.electronAPI.startChat({
                content: lastQuestion.value,
                provideName: provider.name,
                selectedModel: conversation.value.selectedModel,
                messageId: newMessageId
            })
        }
    }
}

onMounted(async () => {
    await dealPage(conversationId)
    if (initMessageId) {
        const lastMessage = await db.messages.where({ conversationId }).last()
        lastQuestion.value = lastMessage?.content || ''
        await createInitialMessage()
    }
    window.electronAPI.onUpdateMessage(async (streamData) => {
        const { messageId, data } = streamData
        const currentMessage = await db.messages.where({ id: messageId }).first()
        if (currentMessage) {
            const updatedData = {
                content: currentMessage.content + data.result,
                status: data.is_end ? 'finished' : 'streaming' as MessageStatus,
                updatedAt: new Date().toISOString()
            }
            await db.messages.update(messageId, updatedData)
            const index = filteredMessages.value.findIndex(item => item.id === messageId)
            if (index !== -1) {
                filteredMessages.value[index] = {
                    ...filteredMessages.value[index],
                    ...updatedData
                }
            }
        }
    })
})

watch(() => route.params.id, async (newId: string) => {
    await dealPage(+newId)
})

</script>
