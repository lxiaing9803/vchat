<template>
    <div
        class="message-input w-full shadow-sm border rounded-lg border-gray-300 py-1 px-2 focus-within:border-green-700 flex items-center">
        <input :disabled="disabled" class="outline-none border-0 flex-1 bg-white focus:ring-0" type="text"
            v-model="model" placeholder="请输入问题">
        <Button :disabled="disabled" @click="onCreate" iconName="radix-icons:paper-plane">
            发送
        </Button>
    </div>
</template>

<script lang="ts" setup>
import Button from './Button.vue';
defineProps<{
    disabled?: boolean
}>()
const emit = defineEmits<{
    create: [value: string, imagePath?: string]
}>()
const model = defineModel<string>()

let selectedImage: File | null = null

const onCreate = () => {
    if (model.value && model.value.trim() !== '') {
        emit('create', model.value)
    }
}

</script>