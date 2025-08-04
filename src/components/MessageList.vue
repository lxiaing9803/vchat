<template>
    <div class="message-list" ref="_ref">
        <div class="message-item mb-3" v-for="message in messages" :key="message.id">
            <div class="flex" :class="{ 'justify-end': message.type === 'question' }">
                <div>
                    <div class="text-sm text-gray-500 mb-2" :class="{ 'text-right': message.type === 'question' }">
                        {{ dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
                    <div class=" message-question bg-green-700 text-white rounded-md p-2"
                        v-if="message.type === 'question'">
                        {{ message.content }}
                    </div>
                    <div class="message-answer bg-gray-200 text-gray-700  rounded-md p-2" v-else>
                        <template v-if="message.status === 'loading'">
                            <Icon icon="eos-icons:three-dots-loading" />
                        </template>
                        <div class="prose prose-slate prose-headings:my-2 prose-li:my-0 prose-ul:my-1 prose-pre:p-0"
                            v-else>
                            <VueMarkdown :source="message.content" :plugins="plugins" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { MessageProps } from '@/types'
import VueMarkdown from 'vue-markdown-render';
import MarkdownItHightlightjs from 'markdown-it-highlightjs'
import { Icon } from '@iconify/vue';
import { ref } from 'vue'
import dayjs from 'dayjs'

const _ref = ref<HTMLElement>()

const plugins = [MarkdownItHightlightjs]

defineExpose({
    ref: _ref
})

defineProps<{
    messages: MessageProps[]
}>()
</script>