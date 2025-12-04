<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore, useBookmarkStore, useFolderStore } from '@/stores'
import { useTheme } from '@/composables'
import { MainLayout } from '@/components/layout'
import { SearchBox } from '@/components/search'
import { BookmarkGrid } from '@/components/bookmark'
import { SettingsPanel, ThemeToggle } from '@/components/settings'

const settingsStore = useSettingsStore()
const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()

useTheme()

onMounted(async () => {
  await Promise.all([
    settingsStore.loadSettings(),
    bookmarkStore.loadBookmarks(),
    folderStore.loadFolders(),
  ])
})
</script>

<template>
  <MainLayout>
    <SearchBox />

    <BookmarkGrid />

    <div class="fixed bottom-4 right-4 flex items-center gap-2">
      <ThemeToggle />
      <SettingsPanel />
    </div>
  </MainLayout>
</template>
