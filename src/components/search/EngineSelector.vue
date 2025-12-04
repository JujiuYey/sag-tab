<script setup lang="ts">
import { ref } from 'vue'
import type { SearchEngine } from '@/types'

interface Props {
  modelValue: SearchEngine
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchEngine]
}>()

const isOpen = ref(false)

const engines: { value: SearchEngine; label: string; icon: string }[] = [
  { value: 'google', label: 'Google', icon: 'https://www.google.com/favicon.ico' },
  { value: 'baidu', label: '百度', icon: 'https://www.baidu.com/favicon.ico' },
]

function selectEngine(engine: SearchEngine) {
  emit('update:modelValue', engine)
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <button
      class="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      @click="isOpen = !isOpen"
    >
      <img
        :src="engines.find(e => e.value === modelValue)?.icon"
        :alt="modelValue"
        class="h-4 w-4"
      />
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute left-0 top-full z-10 mt-1 w-32 rounded-lg bg-white py-1 shadow-lg dark:bg-gray-800"
    >
      <button
        v-for="engine in engines"
        :key="engine.value"
        class="flex w-full items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="selectEngine(engine.value)"
      >
        <img :src="engine.icon" :alt="engine.label" class="h-4 w-4" />
        <span>{{ engine.label }}</span>
      </button>
    </div>

    <div
      v-if="isOpen"
      class="fixed inset-0 z-0"
      @click="isOpen = false"
    />
  </div>
</template>
