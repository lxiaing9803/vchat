<template>
    <div class="bg-white h-full flex-1 flex items-center">
        <div class="w-[80%] mx-auto h-full">
            <div class="flex items-center h-[85%]">
                <ProviderSelect :items="providers" v-model="selectedModel" />
            </div>
            <div class=" flex items-center h-[15%]">
                <MessageInput />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProviderSelect from "@/components/ProviderSelect.vue";
import MessageInput from "@/components/MessageInput.vue";
import { ref } from "vue";
import { providers } from "@/testData";

const selectedModel = ref<string>('')


console.log(
    '👋 This message is being logged by "renderer.ts", included via Vite',
);
</script>

<style scoped></style>