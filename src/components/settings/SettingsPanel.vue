<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, BaseIcon } from '@/components/common'
import ThemeToggle from './ThemeToggle.vue'
import BackgroundPicker from './BackgroundPicker.vue'
import DataManager from './DataManager.vue'

const isOpen = ref(false)
</script>

<template>
  <div>
    <button
      class="rounded-lg p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
      title="设置"
      @click="isOpen = true"
    >
      <BaseIcon name="cog" :size="20" />
    </button>

    <BaseModal v-if="isOpen" title="设置" @close="isOpen = false">
      <div class="space-y-6">
        <div>
          <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">主题</h3>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">切换主题：</span>
            <ThemeToggle />
          </div>
        </div>

        <div>
          <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">背景</h3>
          <BackgroundPicker />
        </div>

        <div>
          <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">数据管理</h3>
          <DataManager />
        </div>
      </div>
    </BaseModal>
  </div>
</template>
