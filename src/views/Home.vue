<template>
    <div class="bg-white h-full flex-1 flex items-center">
        <div class="w-[80%] mx-auto h-full">
            <div class="flex items-center h-[85%]">
                <ProviderSelect :items="providers" v-model="currentProvider" />
            </div>
            <div class=" flex items-center h-[15%]">
                <MessageInput @create="createConversation" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProviderSelect from "@/components/ProviderSelect.vue";
import MessageInput from "@/components/MessageInput.vue";
import { computed, onMounted, ref } from "vue";
import { ProviderProps } from "@/types";
import { db } from "@/db";
import { useRouter } from "vue-router";

const navigate = useRouter()

const currentProvider = ref<any>('')
const providers = ref<ProviderProps[]>([])

onMounted(async () => {
    providers.value = await db.providers.toArray()
})

const modelInfo = computed(() => {
    const [providerId, selectedModel] = currentProvider.value.split('/')
    return {
        providerId: parseInt(providerId),
        selectedModel,
    }
})

const createConversation = async (question: string) => {
    const { providerId, selectedModel } = modelInfo.value
    const currentDate = new Date().toISOString()
    const conversationId = await db.conversations.add({
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
        type: 'question',
    })
    navigate.push(`/conversation/${conversationId}?init=${newMessageId}`)
}

console.log(
    '👋 This message is being logged by "renderer.ts", included via Vite',
);
</script>

<style scoped></style>