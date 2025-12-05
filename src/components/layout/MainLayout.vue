<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores'
import type { ImageConfig } from '@/types'
import { defaultImageConfig } from '@/types'

const settingsStore = useSettingsStore()

const imageConfig = computed<ImageConfig>(() => {
  return settingsStore.settings.background.imageConfig || defaultImageConfig
})

const isImageBackground = computed(() => {
  return (
    settingsStore.settings.background.type === 'image' && settingsStore.backgroundImage
  )
})

const backgroundStyle = computed(() => {
  const { type, value } = settingsStore.settings.background

  if (type === 'image' && settingsStore.backgroundImage) {
    const config = imageConfig.value
    const styles: Record<string, string> = {
      backgroundImage: `url(${settingsStore.backgroundImage})`,
      backgroundPosition: 'center',
      backgroundRepeat: config.displayMode === 'tile' ? 'repeat' : 'no-repeat',
    }

    switch (config.displayMode) {
      case 'cover':
        styles.backgroundSize = 'cover'
        break
      case 'contain':
        styles.backgroundSize = 'contain'
        break
      case 'fill':
        styles.backgroundSize = '100% 100%'
        break
      case 'tile':
        styles.backgroundSize = 'auto'
        break
      case 'center':
        styles.backgroundSize = 'auto'
        break
    }

    return styles
  }

  return { backgroundColor: value }
})

const showOverlay = computed(() => {
  return isImageBackground.value && imageConfig.value.overlay
})

const overlayStyle = computed(() => {
  if (!showOverlay.value) return {}

  const config = imageConfig.value
  const opacity = config.overlayOpacity / 100

  return {
    backgroundColor: config.overlayColor,
    opacity: opacity,
  }
})

const blurStyle = computed(() => {
  if (!isImageBackground.value) return {}

  const blur = imageConfig.value.blur
  if (blur <= 0) return {}

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
  }
})
</script>

<template>
  <div
    class="min-h-screen transition-colors"
    :class="{ dark: settingsStore.settings.theme === 'dark' }"
  >
    <div class="fixed inset-0 -z-10" :style="backgroundStyle">
      <div
        v-if="isImageBackground && imageConfig.blur > 0"
        class="absolute inset-0"
        :style="blurStyle"
      />

      <div
        v-if="showOverlay"
        class="absolute inset-0 transition-opacity"
        :style="overlayStyle"
      />
    </div>

    <div class="relative min-h-screen">
      <div class="container mx-auto max-w-5xl px-4 py-8">
        <slot />
      </div>
    </div>
  </div>
</template>
