<template>
    <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between">
        <h3 class="font-semibold text-gray-900 text-lg">{{ conversation?.title }}</h3>
        <span class="text-gray-500 text-sm">{{ dayjs(conversation?.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
    </div>
    <div class="w-[80%] mx-auto h-[75%] overflow-y-auto scrollbar-hide pt-2">
        <MessageList :messages="filteredMessages" ref="messageListRef" />
    </div>
    <div class="w-[80%] mx-auto h-[15%] flex items-center ">
        <MessageInput v-model="inputValue" @create="sendNewMessage" :disabled="messageStore.isMessageLoading" />
    </div>
</template>

<script setup lang="ts">
import MessageInput from '@/components/MessageInput.vue'
import MessageList from '@/components/MessageList.vue'
import { useRoute } from 'vue-router'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { MessageListInstance, MessageProps, MessageRoleType } from '@/types'
import { useConversationStore } from '@/stores/conversation'
import { useMessageStore } from '@/stores/message'
import dayjs from 'dayjs'
import { useProviderStore } from '@/stores/provider'

const route = useRoute()
const conversationStore = useConversationStore()
const messageStore = useMessageStore()

const inputValue = ref('')

const messageListRef = ref<MessageListInstance>()

const conversationId = ref(parseInt(route.params.id as string))
const initMessageId = parseInt(route.query.init as string)
const providerStore = useProviderStore()
const conversation = computed(() => conversationStore.getConversationById(conversationId.value))
const filteredMessages = computed(() => messageStore.items)
const sendedMessages = computed(() => filteredMessages.value.filter(item => item.status !== 'loading').map(message => {
    return {
        role: (message.type === 'question' ? 'user' : 'assistant') as MessageRoleType,
        content: message.content
    }
}))

const dealPage = async (id: number) => {
    conversationId.value = id
    await messageStore.fetchMessagesByConversation(conversationId.value)
}

const sendNewMessage = async (question: string) => {
    if (question) {
        const date = new Date().toISOString()
        await messageStore.createMessage({
            content: question,
            conversationId: conversationId.value,
            type: 'question',
            createdAt: date,
            updatedAt: date,
        })
        inputValue.value = ''
        await createInitialMessage()
    }
}

const messageListScrollToBottom = async () => {
    if (messageListRef.value) {
        messageListRef.value.ref.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        })
    }
}

const createInitialMessage = async () => {
    const createdData: Omit<MessageProps, 'id'> = {
        content: '',
        conversationId: conversationId.value,
        type: 'answer',
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        status: 'loading'
    }
    const newMessageId = await messageStore.createMessage(createdData)
    await messageListScrollToBottom()
    if (conversation.value) {
        const provider = await providerStore.getProviderById(conversation.value.providerId)
        if (provider) {
            await window.electronAPI.startChat({
                provideName: provider.name,
                selectedModel: conversation.value.selectedModel,
                messageId: newMessageId,
                messages: sendedMessages.value
            })
        }
    }
}

onMounted(async () => {
    await dealPage(conversationId.value)
    await nextTick()
    await messageListScrollToBottom()
    if (initMessageId) {
        await createInitialMessage()
    }
    let currentMessageListHeight = 0
    const checkAndScrollToBottom = async () => {
        if (messageListRef.value) {
            const newHeight = messageListRef.value.ref.clientHeight
            if (newHeight > currentMessageListHeight) {
                currentMessageListHeight = newHeight
                await messageListScrollToBottom()
            }
        }
    }
    window.electronAPI.onUpdateMessage(async (streamData) => {
        await messageStore.updateMessage(streamData)
        await nextTick()
        await checkAndScrollToBottom()
    })
})

watch(() => route.params.id, async (newId: string) => {
    await dealPage(+newId)
    await messageListScrollToBottom()
})

</script>
