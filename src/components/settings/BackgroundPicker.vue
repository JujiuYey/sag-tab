<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import type { BackgroundType } from '@/types'
import ImageBackgroundPicker from './ImageBackgroundPicker.vue'

const settingsStore = useSettingsStore()

const solidColors = [
  '#f5f5f5',
  '#e0e7ff',
  '#fce7f3',
  '#d1fae5',
  '#fef3c7',
  '#1f2937',
  '#111827',
]

function setBackground(type: BackgroundType, value: string) {
  settingsStore.setBackground({ type, value })
}

function isSelected(type: BackgroundType, value: string): boolean {
  const bg = settingsStore.settings.background
  return bg.type === type && bg.value === value
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">纯色背景</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="color in solidColors"
          :key="color"
          class="h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110"
          :class="{
            'border-blue-500': isSelected('solid', color),
            'border-transparent': !isSelected('solid', color),
          }"
          :style="{ backgroundColor: color }"
          @click="setBackground('solid', color)"
        />
      </div>
    </div>

    <hr class="border-gray-200 dark:border-gray-700" />

    <ImageBackgroundPicker />
  </div>
</template>
