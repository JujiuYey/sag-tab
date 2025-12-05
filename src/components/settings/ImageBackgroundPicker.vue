<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores'
import { BaseIcon } from '@/components/common'
import type { ImageDisplayMode, ImageConfig } from '@/types'
import { defaultImageConfig } from '@/types'
import { compressImage, validateImageFile, type CompressionResult } from '@/utils'

const settingsStore = useSettingsStore()

const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadError = ref('')
const compressionInfo = ref<CompressionResult | null>(null)

const displayModes: { value: ImageDisplayMode; label: string }[] = [
  { value: 'cover', label: '覆盖' },
  { value: 'contain', label: '适应' },
  { value: 'fill', label: '填充' },
  { value: 'tile', label: '平铺' },
  { value: 'center', label: '居中' },
]

const imageConfig = computed<ImageConfig>(() => {
  return settingsStore.settings.background.imageConfig || defaultImageConfig
})

const hasBackgroundImage = computed(() => {
  return (
    settingsStore.settings.background.type === 'image' && settingsStore.backgroundImage
  )
})

const previewUrl = computed(() => {
  return settingsStore.backgroundImage || ''
})

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploadError.value = ''
  compressionInfo.value = null

  const validation = validateImageFile(file)
  if (!validation.valid) {
    uploadError.value = validation.error || '文件验证失败'
    target.value = ''
    return
  }

  isUploading.value = true

  try {
    const result = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8,
      maxSizeKB: 500,
    })

    compressionInfo.value = result
    await settingsStore.setBackgroundImage(result.dataUrl)
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : '上传失败'
  } finally {
    isUploading.value = false
    target.value = ''
  }
}

async function removeImage() {
  await settingsStore.removeBackgroundImage()
  compressionInfo.value = null
}

async function updateDisplayMode(mode: ImageDisplayMode) {
  await settingsStore.updateImageConfig({ displayMode: mode })
}

async function updateOverlay(enabled: boolean) {
  await settingsStore.updateImageConfig({ overlay: enabled })
}

async function updateOverlayOpacity(opacity: number) {
  await settingsStore.updateImageConfig({ overlayOpacity: opacity })
}

async function updateBlur(blur: number) {
  await settingsStore.updateImageConfig({ blur })
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        自定义背景图片
      </h4>

      <div v-if="!hasBackgroundImage" class="space-y-2">
        <button
          class="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-700"
          :disabled="isUploading"
          @click="triggerUpload"
        >
          <div class="text-center">
            <BaseIcon name="upload" :size="24" class="mx-auto mb-1 text-gray-400" />
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ isUploading ? '上传中...' : '点击上传图片' }}
            </span>
          </div>
        </button>
        <p class="text-xs text-gray-400 dark:text-gray-500">
          支持 JPG、PNG、GIF、WebP，最大 10MB
        </p>
      </div>

      <div v-else class="space-y-3">
        <div class="relative overflow-hidden rounded-lg">
          <img :src="previewUrl" alt="背景预览" class="h-32 w-full object-cover" />
          <div class="absolute right-2 top-2 flex gap-1">
            <button
              class="rounded bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
              title="更换图片"
              @click="triggerUpload"
            >
              <BaseIcon name="upload" :size="16" />
            </button>
            <button
              class="rounded bg-red-500/80 p-1.5 text-white transition-colors hover:bg-red-600"
              title="删除图片"
              @click="removeImage"
            >
              <BaseIcon name="trash" :size="16" />
            </button>
          </div>
        </div>

        <div v-if="compressionInfo" class="text-xs text-gray-500 dark:text-gray-400">
          图片已压缩：{{ formatSize(compressionInfo.originalSize) }} →
          {{ formatSize(compressionInfo.compressedSize) }} ({{ compressionInfo.width }}x{{
            compressionInfo.height
          }})
        </div>

        <div>
          <label
            class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            展示模式
          </label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="mode in displayModes"
              :key="mode.value"
              class="rounded px-2.5 py-1 text-xs transition-colors"
              :class="[
                imageConfig.displayMode === mode.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
              ]"
              @click="updateDisplayMode(mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <div>
          <div class="mb-1.5 flex items-center justify-between">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
              遮罩层
            </label>
            <label class="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                :checked="imageConfig.overlay"
                class="peer sr-only"
                @change="updateOverlay(!imageConfig.overlay)"
              />
              <div
                class="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-gray-700"
              ></div>
            </label>
          </div>

          <div v-if="imageConfig.overlay" class="mt-2">
            <div
              class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
            >
              <span>透明度</span>
              <span>{{ imageConfig.overlayOpacity }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              :value="imageConfig.overlayOpacity"
              class="slider mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
              @input="
                updateOverlayOpacity(Number(($event.target as HTMLInputElement).value))
              "
            />
          </div>
        </div>

        <div>
          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
          >
            <span>背景模糊</span>
            <span>{{ imageConfig.blur }}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            :value="imageConfig.blur"
            class="slider mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
            @input="updateBlur(Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>

      <p v-if="uploadError" class="mt-2 text-sm text-red-500">
        {{ uploadError }}
      </p>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>
