const STORAGE_KEYS = {
  BOOKMARKS: 'sag-tab-bookmarks',
  FOLDERS: 'sag-tab-folders',
  SETTINGS: 'sag-tab-settings',
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

function isExtensionEnv(): boolean {
  return typeof chrome !== 'undefined' && chrome.storage !== undefined
}

export async function getStorage<T>(key: StorageKey): Promise<T | null> {
  if (isExtensionEnv()) {
    const result = await chrome.storage.local.get(key)
    return (result[key] as T) ?? null
  }
  const data = localStorage.getItem(key)
  return data ? (JSON.parse(data) as T) : null
}

export async function setStorage<T>(key: StorageKey, value: T): Promise<void> {
  if (isExtensionEnv()) {
    await chrome.storage.local.set({ [key]: value })
    return
  }
  localStorage.setItem(key, JSON.stringify(value))
}

export async function removeStorage(key: StorageKey): Promise<void> {
  if (isExtensionEnv()) {
    await chrome.storage.local.remove(key)
    return
  }
  localStorage.removeItem(key)
}

export { STORAGE_KEYS }
