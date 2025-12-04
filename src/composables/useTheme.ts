import { watchEffect } from 'vue'
import { useSettingsStore } from '@/stores'

export function useTheme() {
  const settingsStore = useSettingsStore()

  watchEffect(() => {
    const isDark = settingsStore.settings.theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
  })

  return {
    theme: settingsStore.settings.theme,
    setTheme: settingsStore.setTheme,
  }
}
