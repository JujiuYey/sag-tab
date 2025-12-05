import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Settings, Theme, SearchEngine, Background, ImageConfig } from '@/types'
import { defaultSettings, defaultImageConfig } from '@/types'
import { getStorage, setStorage, STORAGE_KEYS } from '@/utils'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({ ...defaultSettings })
  const backgroundImage = ref<string>('')

  async function loadSettings() {
    const stored = await getStorage<Settings>(STORAGE_KEYS.SETTINGS)
    if (stored) {
      settings.value = stored
    }

    const storedImage = await getStorage<string>(STORAGE_KEYS.BACKGROUND_IMAGE)
    if (storedImage) {
      backgroundImage.value = storedImage
    }
  }

  async function saveSettings() {
    await setStorage(STORAGE_KEYS.SETTINGS, settings.value)
  }

  async function setTheme(theme: Theme) {
    settings.value.theme = theme
    await saveSettings()
  }

  async function setSearchEngine(engine: SearchEngine) {
    settings.value.searchEngine = engine
    await saveSettings()
  }

  async function setBackground(background: Background) {
    settings.value.background = background
    await saveSettings()
  }

  async function setBackgroundImage(
    imageDataUrl: string,
    config?: Partial<ImageConfig>
  ) {
    backgroundImage.value = imageDataUrl
    settings.value.background = {
      type: 'image',
      value: '',
      imageConfig: {
        ...defaultImageConfig,
        ...config,
      },
    }

    await Promise.all([
      setStorage(STORAGE_KEYS.BACKGROUND_IMAGE, imageDataUrl),
      saveSettings(),
    ])
  }

  async function updateImageConfig(config: Partial<ImageConfig>) {
    if (settings.value.background.type === 'image') {
      settings.value.background.imageConfig = {
        ...defaultImageConfig,
        ...settings.value.background.imageConfig,
        ...config,
      }
      await saveSettings()
    }
  }

  async function removeBackgroundImage() {
    backgroundImage.value = ''
    settings.value.background = {
      type: 'solid',
      value: defaultSettings.background.value,
    }

    await Promise.all([
      setStorage(STORAGE_KEYS.BACKGROUND_IMAGE, ''),
      saveSettings(),
    ])
  }

  return {
    settings,
    backgroundImage,
    loadSettings,
    saveSettings,
    setTheme,
    setSearchEngine,
    setBackground,
    setBackgroundImage,
    updateImageConfig,
    removeBackgroundImage,
  }
})
