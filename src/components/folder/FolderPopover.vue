<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Folder, Bookmark } from '@/types'
import { useBookmarkStore } from '@/stores'
import { BaseIcon, ConfirmDialog } from '@/components/common'
import { BookmarkCard, BookmarkForm } from '@/components/bookmark'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  folder: Folder
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  edit: []
  delete: []
}>()

const bookmarkStore = useBookmarkStore()

const folderBookmarks = computed(() =>
  bookmarkStore.getBookmarksByFolder(props.folder.id)
)

const showBookmarkForm = ref(false)
const editingBookmark = ref<Bookmark | null>(null)
const deletingBookmark = ref<Bookmark | null>(null)
const showDeleteDialog = ref(false)
const isOpen = ref(true)

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
    await bookmarkStore.addBookmark({ ...data, groupId: props.folder.id })
  }
  showBookmarkForm.value = false
  editingBookmark.value = null
}

function handleDeleteBookmarkClick(bookmark: Bookmark) {
  deletingBookmark.value = bookmark
  showDeleteDialog.value = true
}

async function handleDeleteBookmark() {
  if (deletingBookmark.value) {
    await bookmarkStore.deleteBookmark(deletingBookmark.value.id)
    deletingBookmark.value = null
    showDeleteDialog.value = false
  }
}

function handleOpenChange(open: boolean) {
  if (!open) {
    emit('close')
  }
  isOpen.value = open
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <div class="flex items-center justify-between">
          <DialogTitle>{{ folder.name }}</DialogTitle>
          <div class="flex gap-2">
            <Button variant="ghost" size="icon" @click="emit('edit')">
              <BaseIcon name="pencil" :size="16" />
            </Button>
            <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive" @click="emit('delete')">
              <BaseIcon name="trash" :size="16" />
            </Button>
          </div>
        </div>
      </DialogHeader>

      <div class="flex flex-wrap justify-center gap-2">
        <BookmarkCard
          v-for="bookmark in folderBookmarks"
          :key="bookmark.id"
          :bookmark="bookmark"
          @edit="handleEditBookmark(bookmark)"
          @delete="handleDeleteBookmarkClick(bookmark)"
        />

        <div class="flex w-24 flex-col items-center gap-2 p-3">
          <button
            class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-400 dark:border-gray-600"
            @click="handleAddBookmark"
          >
            <BaseIcon name="plus" :size="24" />
          </button>
          <span class="text-xs text-gray-500 dark:text-gray-400">添加书签</span>
        </div>
      </div>

      <BookmarkForm
        :bookmark="editingBookmark ?? undefined"
        :mode="editingBookmark ? 'edit' : 'add'"
        :open="showBookmarkForm"
        @submit="handleBookmarkSubmit"
        @update:open="showBookmarkForm = $event"
      />

      <ConfirmDialog
        :open="showDeleteDialog"
        title="删除书签"
        :message="deletingBookmark ? `确定要删除书签「${deletingBookmark.name}」吗？` : ''"
        @confirm="handleDeleteBookmark"
        @cancel="showDeleteDialog = false; deletingBookmark = null"
        @update:open="(v) => { if (!v) { showDeleteDialog = false; deletingBookmark = null } }"
      />
    </DialogContent>
  </Dialog>
</template>
