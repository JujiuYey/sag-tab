<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Folder, Bookmark } from '@/types'
import { useBookmarkStore } from '@/stores'
import { BaseModal, BaseIcon, ConfirmDialog } from '@/components/common'
import { BookmarkCard, BookmarkForm } from '@/components/bookmark'

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

async function handleDeleteBookmark() {
  if (deletingBookmark.value) {
    await bookmarkStore.deleteBookmark(deletingBookmark.value.id)
    deletingBookmark.value = null
  }
}
</script>

<template>
  <BaseModal :title="folder.name" @close="emit('close')">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex gap-2">
        <button
          class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          @click="emit('edit')"
        >
          <BaseIcon name="pencil" :size="16" />
        </button>
        <button
          class="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
          @click="emit('delete')"
        >
          <BaseIcon name="trash" :size="16" />
        </button>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-2">
      <BookmarkCard
        v-for="bookmark in folderBookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        @edit="handleEditBookmark(bookmark)"
        @delete="deletingBookmark = bookmark"
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
      v-if="showBookmarkForm"
      :bookmark="editingBookmark ?? undefined"
      :mode="editingBookmark ? 'edit' : 'add'"
      @submit="handleBookmarkSubmit"
      @close="showBookmarkForm = false"
    />

    <ConfirmDialog
      v-if="deletingBookmark"
      title="删除书签"
      :message="`确定要删除书签「${deletingBookmark.name}」吗？`"
      @confirm="handleDeleteBookmark"
      @cancel="deletingBookmark = null"
    />
  </BaseModal>
</template>
