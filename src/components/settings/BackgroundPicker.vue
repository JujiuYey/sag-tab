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

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
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

    <div>
      <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">渐变背景</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="gradient in gradients"
          :key="gradient"
          class="h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110"
          :class="{
            'border-blue-500': isSelected('gradient', gradient),
            'border-transparent': !isSelected('gradient', gradient),
          }"
          :style="{ background: gradient }"
          @click="setBackground('gradient', gradient)"
        />
      </div>
    </div>

    <hr class="border-gray-200 dark:border-gray-700" />

    <ImageBackgroundPicker />
  </div>
</template>
