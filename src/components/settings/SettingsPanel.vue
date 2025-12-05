<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, BaseIcon } from '@/components/common'
import ThemeToggle from './ThemeToggle.vue'
import BackgroundPicker from './BackgroundPicker.vue'
import DataManager from './DataManager.vue'

type MenuType = 'theme' | 'background' | 'data'

const isOpen = ref(false)
const activeMenu = ref<MenuType>('theme')

const menuItems: { key: MenuType; label: string }[] = [
  { key: 'theme', label: '主题设置' },
  { key: 'background', label: '背景设置' },
  { key: 'data', label: '数据管理' },
]
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

    <BaseModal v-if="isOpen" title="设置" size="lg" @close="isOpen = false">
      <div class="flex h-[70vh]">
        <!-- 左侧菜单 -->
        <div class="w-28 shrink-0 space-y-1 border-r border-gray-200 pr-4 dark:border-gray-700">
          <button
            v-for="item in menuItems"
            :key="item.key"
            class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
            :class="
              activeMenu === item.key
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            "
            @click="activeMenu = item.key"
          >
            {{ item.label }}
          </button>
        </div>

        <!-- 右侧内容 -->
        <div class="min-h-0 flex-1 overflow-y-auto pl-6">
          <!-- 主题设置 -->
          <div v-if="activeMenu === 'theme'">
            <h3 class="mb-4 text-sm font-semibold text-gray-900 dark:text-white">主题</h3>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">切换主题：</span>
              <ThemeToggle />
            </div>
          </div>

          <!-- 背景设置 -->
          <div v-if="activeMenu === 'background'">
            <h3 class="mb-4 text-sm font-semibold text-gray-900 dark:text-white">背景</h3>
            <BackgroundPicker />
          </div>

          <!-- 数据管理 -->
          <div v-if="activeMenu === 'data'">
            <h3 class="mb-4 text-sm font-semibold text-gray-900 dark:text-white">数据管理</h3>
            <DataManager />
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
