<script setup lang="ts">
import { ref } from 'vue'
import type { Bookmark } from '@/types'
import { BaseModal, BaseButton } from '@/components/common'

interface Props {
  bookmark?: Bookmark
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: { name: string; url: string; icon?: string }]
  close: []
}>()

const name = ref(props.bookmark?.name || '')
const url = ref(props.bookmark?.url || '')
const icon = ref(props.bookmark?.icon || '')

function handleSubmit() {
  if (!name.value.trim() || !url.value.trim()) return

  let finalUrl = url.value.trim()
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = 'https://' + finalUrl
  }

  emit('submit', {
    name: name.value.trim(),
    url: finalUrl,
    icon: icon.value.trim() || undefined,
  })
}
</script>

<template>
  <BaseModal
    :title="mode === 'add' ? '添加书签' : '编辑书签'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          名称
        </label>
        <input
          v-model="name"
          type="text"
          required
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="网站名称"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          网址
        </label>
        <input
          v-model="url"
          type="text"
          required
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          图标 URL（可选）
        </label>
        <input
          v-model="icon"
          type="text"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="留空将自动获取网站图标"
        />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="secondary" @click="emit('close')">
          取消
        </BaseButton>
        <BaseButton type="submit">
          {{ mode === 'add' ? '添加' : '保存' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
