<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Bookmark, Folder } from '@/types'
import { useBookmarkStore, useFolderStore } from '@/stores'
import BookmarkCard from './BookmarkCard.vue'
import BookmarkForm from './BookmarkForm.vue'
import { FolderCard, FolderPopover, FolderForm } from '@/components/folder'
import { BaseIcon, ConfirmDialog } from '@/components/common'

const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()

const showBookmarkForm = ref(false)
const showFolderForm = ref(false)
const editingBookmark = ref<Bookmark | null>(null)
const editingFolder = ref<Folder | null>(null)
const deletingBookmark = ref<Bookmark | null>(null)
const deletingFolder = ref<Folder | null>(null)
const openFolder = ref<Folder | null>(null)

type GridItem =
  | { type: 'bookmark'; data: Bookmark }
  | { type: 'folder'; data: Folder }

const gridItems = computed<GridItem[]>(() => {
  const bookmarkItems: GridItem[] = bookmarkStore.rootBookmarks.map((b) => ({
    type: 'bookmark',
    data: b,
  }))
  const folderItems: GridItem[] = folderStore.sortedFolders.map((f) => ({
    type: 'folder',
    data: f,
  }))

  return [...bookmarkItems, ...folderItems].sort((a, b) => a.data.order - b.data.order)
})

function handleAddBookmark() {
  editingBookmark.value = null
  showBookmarkForm.value = true
}

function handleEditBookmark(bookmark: Bookmark) {
  editingBookmark.value = bookmark
  showBookmarkForm.value = true
}

async function handleBookmarkSubmit(data: { name: string; url: string; icon?: string }) {
  if (editingBookmark.value) {
    await bookmarkStore.updateBookmark(editingBookmark.value.id, data)
  } else {
    await bookmarkStore.addBookmark(data)
  }
  showBookmarkForm.value = false
  editingBookmark.value = null
}

async function handleDeleteBookmark() {
  if (deletingBookmark.value) {
    await bookmarkStore.deleteBookmark(deletingBookmark.value.id)
    deletingBookmark.value = null
  }
}

function handleAddFolder() {
  editingFolder.value = null
  showFolderForm.value = true
}

function handleEditFolder(folder: Folder) {
  editingFolder.value = folder
  showFolderForm.value = true
}

async function handleFolderSubmit(data: { name: string; icon?: string }) {
  if (editingFolder.value) {
    await folderStore.updateFolder(editingFolder.value.id, data)
  } else {
    await folderStore.addFolder(data)
  }
  showFolderForm.value = false
  editingFolder.value = null
}

async function handleDeleteFolder() {
  if (deletingFolder.value) {
    await folderStore.deleteFolder(deletingFolder.value.id, true)
    deletingFolder.value = null
    openFolder.value = null
  }
}

function handleOpenFolder(folder: Folder) {
  openFolder.value = folder
}
</script>

<template>
  <div>
    <div class="flex flex-wrap justify-center gap-2">
      <template v-for="item in gridItems" :key="item.data.id">
        <BookmarkCard
          v-if="item.type === 'bookmark'"
          :bookmark="item.data"
          @edit="handleEditBookmark(item.data)"
          @delete="deletingBookmark = item.data"
        />
        <FolderCard
          v-else
          :folder="item.data"
          @click="handleOpenFolder(item.data)"
          @edit="handleEditFolder(item.data)"
          @delete="deletingFolder = item.data"
        />
      </template>

      <div class="flex w-24 flex-col items-center gap-2 p-3">
        <button
          class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-400 dark:border-gray-600 dark:hover:border-blue-400"
          @click="handleAddBookmark"
        >
          <BaseIcon name="plus" :size="24" />
        </button>
        <span class="text-xs text-gray-500 dark:text-gray-400">添加书签</span>
      </div>

      <div class="flex w-24 flex-col items-center gap-2 p-3">
        <button
          class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-400 dark:border-gray-600 dark:hover:border-blue-400"
          @click="handleAddFolder"
        >
          <BaseIcon name="folder" :size="24" />
        </button>
        <span class="text-xs text-gray-500 dark:text-gray-400">添加文件夹</span>
      </div>
    </div>

    <BookmarkForm
      v-if="showBookmarkForm"
      :bookmark="editingBookmark ?? undefined"
      :mode="editingBookmark ? 'edit' : 'add'"
      @submit="handleBookmarkSubmit"
      @close="showBookmarkForm = false"
    />

    <FolderForm
      v-if="showFolderForm"
      :folder="editingFolder ?? undefined"
      :mode="editingFolder ? 'edit' : 'add'"
      @submit="handleFolderSubmit"
      @close="showFolderForm = false"
    />

    <FolderPopover
      v-if="openFolder"
      :folder="openFolder"
      @close="openFolder = null"
      @edit="handleEditFolder(openFolder!)"
      @delete="deletingFolder = openFolder"
    />

    <ConfirmDialog
      v-if="deletingBookmark"
      title="删除书签"
      :message="`确定要删除书签「${deletingBookmark.name}」吗？`"
      @confirm="handleDeleteBookmark"
      @cancel="deletingBookmark = null"
    />

    <ConfirmDialog
      v-if="deletingFolder"
      title="删除文件夹"
      :message="`确定要删除文件夹「${deletingFolder.name}」及其所有书签吗？`"
      @confirm="handleDeleteFolder"
      @cancel="deletingFolder = null"
    />
  </div>
</template>
