<script setup lang="ts">
import { ref } from 'vue'
import type { Bookmark } from '@/types'
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
  bookmark?: Bookmark
  mode: 'add' | 'edit'
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: { name: string; url: string; icon?: string }]
  'update:open': [value: boolean]
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

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ mode === 'add' ? '添加书签' : '编辑书签' }}</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">名称</Label>
          <Input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="网站名称"
          />
        </div>

        <div class="space-y-2">
          <Label for="url">网址</Label>
          <Input
            id="url"
            v-model="url"
            type="text"
            required
            placeholder="https://example.com"
          />
        </div>

        <div class="space-y-2">
          <Label for="icon">图标 URL（可选）</Label>
          <Input
            id="icon"
            v-model="icon"
            type="text"
            placeholder="留空将自动获取网站图标"
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
