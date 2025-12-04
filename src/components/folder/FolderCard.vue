<script setup lang="ts">
import type { Folder } from '@/types'
import { BaseIcon } from '@/components/common'

interface Props {
  folder: Folder
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
  edit: []
  delete: []
}>()
</script>

<template>
  <div
    class="group relative flex w-24 cursor-pointer flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-white/50 dark:hover:bg-gray-800/50"
    @click="emit('click')"
  >
    <div class="relative">
      <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 shadow-md dark:bg-amber-900/50">
        <BaseIcon name="folder" :size="28" class="text-amber-500 dark:text-amber-400" />
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
      {{ folder.name }}
    </span>
  </div>
</template>
