import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Folder } from '@/types'
import { generateId, getStorage, setStorage, STORAGE_KEYS } from '@/utils'
import { useBookmarkStore } from './bookmarkStore'

export const useFolderStore = defineStore('folder', () => {
  const folders = ref<Folder[]>([])

  const sortedFolders = computed(() =>
    [...folders.value].sort((a, b) => a.order - b.order)
  )

  async function loadFolders() {
    const stored = await getStorage<Folder[]>(STORAGE_KEYS.FOLDERS)
    if (Array.isArray(stored)) {
      folders.value = stored
    }
  }

  async function saveFolders() {
    await setStorage(STORAGE_KEYS.FOLDERS, folders.value)
  }

  async function addFolder(data: Omit<Folder, 'id' | 'order'>) {
    const maxOrder = Math.max(0, ...folders.value.map((f) => f.order))
    const folder: Folder = {
      ...data,
      id: generateId(),
      order: maxOrder + 1,
    }
    folders.value.push(folder)
    await saveFolders()
    return folder
  }

  async function updateFolder(id: string, data: Partial<Omit<Folder, 'id'>>) {
    const index = folders.value.findIndex((f) => f.id === id)
    if (index !== -1) {
      const folder = folders.value[index]
      if (folder) {
        Object.assign(folder, data)
        await saveFolders()
      }
    }
  }

  async function deleteFolder(id: string, deleteBookmarks = true) {
    const bookmarkStore = useBookmarkStore()

    if (deleteBookmarks) {
      await bookmarkStore.deleteBookmarksByFolder(id)
    } else {
      const folderBookmarks = bookmarkStore.getBookmarksByFolder(id)
      for (const bookmark of folderBookmarks) {
        await bookmarkStore.moveBookmarkToFolder(bookmark.id, undefined)
      }
    }

    const index = folders.value.findIndex((f) => f.id === id)
    if (index !== -1) {
      folders.value.splice(index, 1)
      await saveFolders()
    }
  }

  async function reorderFolders(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const folder = folders.value.find((f) => f.id === id)
      if (folder) {
        folder.order = index
      }
    })
    await saveFolders()
  }

  function setFolders(newFolders: Folder[]) {
    folders.value = newFolders
  }

  return {
    folders,
    sortedFolders,
    loadFolders,
    saveFolders,
    addFolder,
    updateFolder,
    deleteFolder,
    reorderFolders,
    setFolders,
  }
})
