<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores'
import EngineSelector from './EngineSelector.vue'
import { BaseIcon } from '@/components/common'

const settingsStore = useSettingsStore()
const query = ref('')

const searchUrls: Record<string, string> = {
  google: 'https://www.google.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
}

function handleSearch() {
  if (!query.value.trim()) return

  const url = searchUrls[settingsStore.settings.searchEngine] + encodeURIComponent(query.value)
  window.open(url, '_blank')
  query.value = ''
}

function handleEngineChange(engine: 'google' | 'baidu') {
  settingsStore.setSearchEngine(engine)
}
</script>

<template>
  <div class="mx-auto mb-8 flex max-w-xl items-center gap-2">
    <EngineSelector
      :model-value="settingsStore.settings.searchEngine"
      @update:model-value="handleEngineChange"
    />
    <div class="relative flex-1">
      <input
        v-model="query"
        type="text"
        placeholder="搜索..."
        class="w-full rounded-full border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        @keydown.enter="handleSearch"
      />
      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        @click="handleSearch"
      >
        <BaseIcon name="search" :size="18" />
      </button>
    </div>
  </div>
</template>
