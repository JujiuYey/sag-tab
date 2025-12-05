# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**sag-tab** is a minimalist Chrome new tab extension that helps users quickly access their frequently used websites. It features bookmark management, folder organization, search functionality, and customizable themes/backgrounds.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server with hot reload
pnpm dev

# Type-check and build for production
pnpm build

# Preview production build locally
pnpm preview

# Generate extension icons (requires sharp)
node scripts/generate-icons.mjs
```

## Tech Stack

- **Vue 3** with `<script setup>` SFCs and Composition API
- **TypeScript** with strict mode enabled
- **Pinia** for state management
- **VueUse** for utility composables
- **Tailwind CSS v4** for styling (via @tailwindcss/vite plugin)
- **shadcn-vue** for UI components (based on Radix Vue)
- **Vite 7** as the build tool
- **pnpm** as the package manager
- **Chrome Extension Manifest V3**

### shadcn-vue

项目使用 [shadcn-vue](https://www.shadcn-vue.com/) 作为 UI 组件库。shadcn-vue 基于 Radix Vue 和 Tailwind CSS，组件源码直接复制到项目中，便于完全自定义。

**组件存放位置**: `src/components/ui/`

**常用组件**:
- `Button` - 按钮组件
- `Dialog` - 对话框/模态框
- `Popover` - 弹出层
- `Input` - 输入框
- `Select` - 下拉选择
- `Card` - 卡片容器
- `Slider` - 滑块（用于透明度、模糊度调节）
- `Switch` - 开关
- `Tabs` - 标签页
- `DropdownMenu` - 下拉菜单

**添加新组件**:
```bash
npx shadcn-vue@latest add <component-name>
```

**配置文件**: `components.json` (shadcn-vue 配置)

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── App.vue                 # Root component
├── styles/
│   └── main.css            # Global styles with Tailwind
├── types/                  # TypeScript type definitions
│   ├── index.ts            # Exports AppData interface
│   ├── bookmark.ts         # Bookmark type
│   ├── folder.ts           # Folder type
│   └── settings.ts         # Settings type
├── stores/                 # Pinia stores
│   ├── index.ts            # Store exports
│   ├── bookmarkStore.ts    # Bookmark state management
│   ├── folderStore.ts      # Folder state management
│   └── settingsStore.ts    # Settings state management
├── composables/            # Vue composables
│   ├── index.ts            # Composable exports
│   ├── useTheme.ts         # Theme switching logic
│   └── useFavicon.ts       # Favicon fetching logic
├── utils/                  # Utility functions
│   ├── index.ts            # Utility exports
│   ├── id.ts               # ID generation
│   ├── storage.ts          # Chrome storage wrapper
│   ├── export.ts           # Data export/import
│   └── imageCompressor.ts  # Image compression for background upload
└── components/             # Vue components
    ├── ui/                 # shadcn-vue UI components
    │   ├── button/
    │   ├── dialog/
    │   ├── input/
    │   ├─�� popover/
    │   ├── select/
    │   ├── card/
    │   ├── slider/
    │   ├── switch/
    │   ├── tabs/
    │   └── dropdown-menu/
    ├── common/             # Custom reusable components
    │   ├── BaseIcon.vue
    │   └── ConfirmDialog.vue
    ├── layout/             # Layout components
    │   └── MainLayout.vue
    ├── bookmark/           # Bookmark feature
    │   ├── BookmarkCard.vue
    │   ├── BookmarkForm.vue
    │   └── BookmarkGrid.vue
    ├── folder/             # Folder feature
    │   ├── FolderCard.vue
    │   ├── FolderForm.vue
    │   └── FolderPopover.vue
    ├── search/             # Search feature
    │   ├── SearchBox.vue
    │   └── EngineSelector.vue
    └── settings/           # Settings feature
        ├── SettingsPanel.vue
        ├── ThemeToggle.vue
        ├── BackgroundPicker.vue
        ├── ImageBackgroundPicker.vue  # Custom image background upload
        └── DataManager.vue

public/
├── manifest.json           # Chrome extension manifest v3
└── icons/                  # Extension icons (16/32/48/128px)

scripts/
└── generate-icons.mjs      # Icon generation script using sharp

doc/
└── PRD.md                  # Product requirements document
```

## Key Conventions

### Path Aliases

Use `@/` alias for imports from src directory:
```typescript
import { useBookmarkStore } from '@/stores'
import type { Bookmark } from '@/types'
```

### Component Organization

Each feature has its own directory under `components/` with an `index.ts` for exports:
```typescript
// components/bookmark/index.ts
export { default as BookmarkCard } from './BookmarkCard.vue'
```

### State Management

Uses Pinia stores with Chrome storage persistence:
- `useBookmarkStore` - Bookmark CRUD operations
- `useFolderStore` - Folder management
- `useSettingsStore` - User preferences (theme, background, search engine)

### TypeScript Configuration

Strict TypeScript settings enforced:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `erasableSyntaxOnly: true`
- `noUncheckedSideEffectImports: true`

### Build Output

Production build outputs to `dist/` with simplified filenames for extension compatibility:
- `assets/[name].js` (no hash)
- `assets/[name].[ext]` (no hash)

## Chrome Extension Notes

- Uses Manifest V3 with `chrome.storage` API for data persistence
- Overrides the new tab page via `chrome_url_overrides.newtab`
- No background scripts or service workers required
- Uses `unlimitedStorage` permission to support background image storage
- Background images are stored separately in `sag-tab-background-image` key
