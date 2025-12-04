import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Settings, Theme, SearchEngine, Background } from '@/types'
import { defaultSettings } from '@/types'
import { getStorage, setStorage, STORAGE_KEYS } from '@/utils'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({ ...defaultSettings })

  async function loadSettings() {
    const stored = await getStorage<Settings>(STORAGE_KEYS.SETTINGS)
    if (stored) {
      settings.value = stored
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

  return {
    settings,
    loadSettings,
    saveSettings,
    setTheme,
    setSearchEngine,
    setBackground,
  }
})
