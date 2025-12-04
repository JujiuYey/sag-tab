<script setup lang="ts">
import { ref } from 'vue'
import type { Folder } from '@/types'
import { BaseModal, BaseButton } from '@/components/common'

interface Props {
  folder?: Folder
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: { name: string; icon?: string }]
  close: []
}>()

const name = ref(props.folder?.name || '')
const icon = ref(props.folder?.icon || '')

function handleSubmit() {
  if (!name.value.trim()) return

  emit('submit', {
    name: name.value.trim(),
    icon: icon.value.trim() || undefined,
  })
}
</script>

<template>
  <BaseModal
    :title="mode === 'add' ? '添加文件夹' : '编辑文件夹'"
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
          placeholder="文件夹名称"
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
