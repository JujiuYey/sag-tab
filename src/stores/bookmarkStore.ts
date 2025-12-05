import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bookmark } from '@/types'
import { generateId, getStorage, setStorage, STORAGE_KEYS } from '@/utils'

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = ref<Bookmark[]>([])

  const rootBookmarks = computed(() =>
    bookmarks.value
      .filter((b) => !b.groupId)
      .sort((a, b) => a.order - b.order)
  )

  function getBookmarksByFolder(folderId: string) {
    return bookmarks.value
      .filter((b) => b.groupId === folderId)
      .sort((a, b) => a.order - b.order)
  }

  async function loadBookmarks() {
    const stored = await getStorage<Bookmark[]>(STORAGE_KEYS.BOOKMARKS)
    if (Array.isArray(stored)) {
      bookmarks.value = stored
    }
  }

  async function saveBookmarks() {
    await setStorage(STORAGE_KEYS.BOOKMARKS, bookmarks.value)
  }

  async function addBookmark(data: Omit<Bookmark, 'id' | 'order'>) {
    const maxOrder = Math.max(0, ...bookmarks.value.map((b) => b.order))
    const bookmark: Bookmark = {
      ...data,
      id: generateId(),
      order: maxOrder + 1,
    }
    bookmarks.value.push(bookmark)
    await saveBookmarks()
    return bookmark
  }

  async function updateBookmark(id: string, data: Partial<Omit<Bookmark, 'id'>>) {
    const index = bookmarks.value.findIndex((b) => b.id === id)
    if (index !== -1) {
      const bookmark = bookmarks.value[index]
      if (bookmark) {
        Object.assign(bookmark, data)
        await saveBookmarks()
      }
    }
  }

  async function deleteBookmark(id: string) {
    const index = bookmarks.value.findIndex((b) => b.id === id)
    if (index !== -1) {
      bookmarks.value.splice(index, 1)
      await saveBookmarks()
    }
  }

  async function reorderBookmarks(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const bookmark = bookmarks.value.find((b) => b.id === id)
      if (bookmark) {
        bookmark.order = index
      }
    })
    await saveBookmarks()
  }

  async function moveBookmarkToFolder(bookmarkId: string, folderId: string | undefined) {
    const bookmark = bookmarks.value.find((b) => b.id === bookmarkId)
    if (bookmark) {
      bookmark.groupId = folderId
      await saveBookmarks()
    }
  }

  async function deleteBookmarksByFolder(folderId: string) {
    bookmarks.value = bookmarks.value.filter((b) => b.groupId !== folderId)
    await saveBookmarks()
  }

  function setBookmarks(newBookmarks: Bookmark[]) {
    bookmarks.value = newBookmarks
  }

  return {
    bookmarks,
    rootBookmarks,
    getBookmarksByFolder,
    loadBookmarks,
    saveBookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    reorderBookmarks,
    moveBookmarkToFolder,
    deleteBookmarksByFolder,
    setBookmarks,
  }
})
