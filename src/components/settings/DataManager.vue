<script setup lang="ts">
import { ref } from 'vue'
import { useBookmarkStore, useFolderStore, useSettingsStore } from '@/stores'
import { exportData, importData } from '@/utils'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const settingsStore = useSettingsStore()

const fileInput = ref<HTMLInputElement | null>(null)
const showImportConfirm = ref(false)
const pendingFile = ref<File | null>(null)
const importError = ref('')

function handleExport() {
  exportData({
    bookmarks: bookmarkStore.bookmarks,
    folders: folderStore.folders,
    settings: settingsStore.settings,
  })
}

function handleImportClick() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  pendingFile.value = file
  showImportConfirm.value = true
  target.value = ''
}

async function confirmImport() {
  if (!pendingFile.value) return

  try {
    const data = await importData(pendingFile.value)

    bookmarkStore.setBookmarks(data.bookmarks)
    folderStore.setFolders(data.folders)
    Object.assign(settingsStore.settings, data.settings)

    await bookmarkStore.saveBookmarks()
    await folderStore.saveFolders()
    await settingsStore.saveSettings()

    importError.value = ''
  } catch (e) {
    importError.value = e instanceof Error ? e.message : '导入失败'
  }

  showImportConfirm.value = false
  pendingFile.value = null
}

function cancelImport() {
  showImportConfirm.value = false
  pendingFile.value = null
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex gap-2">
      <Button size="sm" variant="secondary" @click="handleExport">
        导出数据
      </Button>
      <Button size="sm" variant="secondary" @click="handleImportClick">
        导入数据
      </Button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleFileChange"
    />

    <p v-if="importError" class="text-sm text-red-500">{{ importError }}</p>

    <AlertDialog :open="showImportConfirm" @update:open="(v: boolean) => !v && cancelImport()">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>导入数据</AlertDialogTitle>
          <AlertDialogDescription>
            导入将覆盖现有的所有数据，确定要继续吗？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="cancelImport">取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmImport">导入</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
