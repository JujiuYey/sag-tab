<script setup lang="ts">
import { ref } from 'vue'
import type { Folder } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  folder?: Folder
  mode: 'add' | 'edit'
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: { name: string; icon?: string }]
  'update:open': [value: boolean]
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

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ mode === 'add' ? '添加文件夹' : '编辑文件夹' }}</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="folder-name">名称</Label>
          <Input
            id="folder-name"
            v-model="name"
            type="text"
            required
            placeholder="文件夹名称"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="handleOpenChange(false)">
            取消
          </Button>
          <Button type="submit">
            {{ mode === 'add' ? '添加' : '保存' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
