export * from './bookmark'
export * from './folder'
export * from './settings'

import type { Bookmark } from './bookmark'
import type { Folder } from './folder'
import type { Settings } from './settings'

export interface AppData {
  bookmarks: Bookmark[]
  folders: Folder[]
  settings: Settings
  version: string
}
