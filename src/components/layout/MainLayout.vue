<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores'

const settingsStore = useSettingsStore()

const backgroundStyle = computed(() => {
  const { type, value } = settingsStore.settings.background
  if (type === 'gradient') {
    return { background: value }
  }
  return { backgroundColor: value }
})
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="{ dark: settingsStore.settings.theme === 'dark' }"
  >
    <div
      class="min-h-screen"
      :style="backgroundStyle"
    >
      <div class="container mx-auto max-w-5xl px-4 py-8">
        <slot />
      </div>
    </div>
  </div>
</template>
