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
const showDeleteBookmarkDialog = ref(false)
const showDeleteFolderDialog = ref(false)

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

function handleDeleteBookmarkClick(bookmark: Bookmark) {
  deletingBookmark.value = bookmark
  showDeleteBookmarkDialog.value = true
}

async function handleDeleteBookmark() {
  if (deletingBookmark.value) {
    await bookmarkStore.deleteBookmark(deletingBookmark.value.id)
    deletingBookmark.value = null
    showDeleteBookmarkDialog.value = false
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

function handleDeleteFolderClick(folder: Folder) {
  deletingFolder.value = folder
  showDeleteFolderDialog.value = true
}

async function handleDeleteFolder() {
  if (deletingFolder.value) {
    await folderStore.deleteFolder(deletingFolder.value.id, true)
    deletingFolder.value = null
    showDeleteFolderDialog.value = false
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
          @delete="handleDeleteBookmarkClick(item.data)"
        />
        <FolderCard
          v-else
          :folder="item.data"
          @click="handleOpenFolder(item.data)"
          @edit="handleEditFolder(item.data)"
          @delete="handleDeleteFolderClick(item.data)"
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
      :bookmark="editingBookmark ?? undefined"
      :mode="editingBookmark ? 'edit' : 'add'"
      :open="showBookmarkForm"
      @submit="handleBookmarkSubmit"
      @update:open="showBookmarkForm = $event"
    />

    <FolderForm
      :folder="editingFolder ?? undefined"
      :mode="editingFolder ? 'edit' : 'add'"
      :open="showFolderForm"
      @submit="handleFolderSubmit"
      @update:open="showFolderForm = $event"
    />

    <FolderPopover
      v-if="openFolder"
      :folder="openFolder"
      @close="openFolder = null"
      @edit="handleEditFolder(openFolder!)"
      @delete="handleDeleteFolderClick(openFolder!)"
    />

    <ConfirmDialog
      :open="showDeleteBookmarkDialog"
      title="删除书签"
      :message="deletingBookmark ? `确定要删除书签「${deletingBookmark.name}」吗？` : ''"
      @confirm="handleDeleteBookmark"
      @cancel="showDeleteBookmarkDialog = false; deletingBookmark = null"
      @update:open="(v) => { if (!v) { showDeleteBookmarkDialog = false; deletingBookmark = null } }"
    />

    <ConfirmDialog
      :open="showDeleteFolderDialog"
      title="删除文件夹"
      :message="deletingFolder ? `确定要删除文件夹「${deletingFolder.name}」及其所有书签吗？` : ''"
      @confirm="handleDeleteFolder"
      @cancel="showDeleteFolderDialog = false; deletingFolder = null"
      @update:open="(v) => { if (!v) { showDeleteFolderDialog = false; deletingFolder = null } }"
    />
  </div>
</template>
