<script setup lang="ts">
import { computed } from 'vue'
import type { Bookmark } from '@/types'
import { BaseIcon } from '@/components/common'

interface Props {
  bookmark: Bookmark
  dragging?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()

const faviconUrl = computed(() => {
  if (props.bookmark.icon) {
    return props.bookmark.icon
  }
  try {
    const url = new URL(props.bookmark.url)
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
  } catch {
    return ''
  }
})

function handleClick() {
  window.open(props.bookmark.url, '_blank')
}
</script>

<template>
  <div
    class="group relative flex w-24 cursor-pointer flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-white/50 dark:hover:bg-gray-800/50"
    :class="{ 'opacity-50': dragging }"
    @click="handleClick"
  >
    <div class="relative">
      <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-md dark:bg-gray-700">
        <img
          v-if="faviconUrl"
          :src="faviconUrl"
          :alt="bookmark.name"
          class="h-8 w-8 rounded"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <BaseIcon v-else name="globe" :size="24" class="text-gray-400" />
      </div>

      <div
        class="absolute -right-1 -top-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        @click.stop
      >
        <button
          class="rounded-full bg-white p-1 shadow hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500"
          @click="emit('edit')"
        >
          <BaseIcon name="pencil" :size="12" class="text-gray-600 dark:text-gray-300" />
        </button>
        <button
          class="rounded-full bg-white p-1 shadow hover:bg-red-50 dark:bg-gray-600 dark:hover:bg-red-900"
          @click="emit('delete')"
        >
          <BaseIcon name="trash" :size="12" class="text-red-500" />
        </button>
      </div>
    </div>

    <span class="w-full truncate text-center text-xs text-gray-700 dark:text-gray-300">
      {{ bookmark.name }}
    </span>
  </div>
</template>
