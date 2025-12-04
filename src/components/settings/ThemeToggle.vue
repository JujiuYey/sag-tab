<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import { BaseIcon } from '@/components/common'

const settingsStore = useSettingsStore()

function toggleTheme() {
  const newTheme = settingsStore.settings.theme === 'light' ? 'dark' : 'light'
  settingsStore.setTheme(newTheme)
}
</script>

<template>
  <button
    class="rounded-lg p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
    @click="toggleTheme"
    :title="settingsStore.settings.theme === 'light' ? '切换到深色模式' : '切换到浅色模式'"
  >
    <BaseIcon
      :name="settingsStore.settings.theme === 'light' ? 'moon' : 'sun'"
      :size="20"
    />
  </button>
</template>
