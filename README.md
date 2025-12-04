# sag-tab

[English](#english) | [中文](#中文)

---

## English

A minimalist new tab page extension for Chrome/Edge that helps you quickly access your favorite websites.

### Features

- **Bookmark Management** - Add, edit, delete bookmarks with auto-fetched favicons or custom icons
- **Folder Organization** - Group bookmarks into folders for better organization
- **Search Integration** - Built-in search box with Google and Baidu engine support
- **Theme Support** - Light/Dark mode with customizable background colors and gradients
- **Drag & Drop** - Reorder bookmarks and folders with intuitive drag-and-drop
- **Data Portability** - Import/Export your data in JSON format

### Tech Stack

- **Vue 3** - Composition API with `<script setup>` SFCs
- **TypeScript** - Strict mode enabled
- **Vite 7** - Fast build tool
- **Pinia** - State management
- **Tailwind CSS 4** - Utility-first styling
- **VueUse** - Vue composition utilities

### Getting Started

#### Prerequisites

- Node.js 18+
- pnpm

#### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sag-tab.git
cd sag-tab

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

#### Build

```bash
# Type-check and build for production
pnpm build

# Preview production build
pnpm preview
```

### Project Structure

```
src/
├── components/       # Vue components
│   ├── BookmarkCard.vue
│   ├── BookmarkForm.vue
│   ├── BookmarkGrid.vue
│   ├── FolderCard.vue
│   ├── FolderForm.vue
│   ├── FolderPopover.vue
│   ├── SearchBox.vue
│   ├── SettingsPanel.vue
│   └── ...
├── composables/      # Vue composables
│   ├── useFavicon.ts
│   └── useTheme.ts
├── stores/           # Pinia stores
│   ├── bookmarkStore.ts
│   ├── folderStore.ts
│   └── settingsStore.ts
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.vue           # Root component
└── main.ts           # Entry point
```

### License

MIT

---

## 中文

一个简约的 Chrome/Edge 新标签页扩展，帮助你快速访问常用网站。

### 功能特性

- **书签管理** - 添加、编辑、删除书签，支持自动获取网站图标或自定义图标
- **文件夹分组** - 将书签整理到文件夹中，方便分类管理
- **搜索集成** - 内置搜索框，支持 Google 和百度搜索引擎
- **主题支持** - 明亮/暗黑模式切换，可自定义背景颜色和渐变
- **拖拽排序** - 通过拖拽直观地重新排列书签和文件夹
- **数据导入导出** - 支持 JSON 格式的数据备份与恢复

### 技术栈

- **Vue 3** - 使用 `<script setup>` 组合式 API
- **TypeScript** - 启用严格模式
- **Vite 7** - 极速构建工具
- **Pinia** - 状态管理
- **Tailwind CSS 4** - 原子化 CSS 框架
- **VueUse** - Vue 组合式工具库

### 快速开始

#### 环境要求

- Node.js 18+
- pnpm

#### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/sag-tab.git
cd sag-tab

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

#### 构建

```bash
# 类型检查并构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

### 项目结构

```
src/
├── components/       # Vue 组件
│   ├── BookmarkCard.vue      # 书签卡片
│   ├── BookmarkForm.vue      # 书签表单
│   ├── BookmarkGrid.vue      # 书签网格
│   ├── FolderCard.vue        # 文件夹卡片
│   ├── FolderForm.vue        # 文件夹表单
│   ├── FolderPopover.vue     # 文件夹弹窗
│   ├── SearchBox.vue         # 搜索框
│   ├── SettingsPanel.vue     # 设置面板
│   └── ...
├── composables/      # Vue 组合式函数
│   ├── useFavicon.ts         # 网站图标处理
│   └── useTheme.ts           # 主题切换
├── stores/           # Pinia 状态仓库
│   ├── bookmarkStore.ts      # 书签状态
│   ├── folderStore.ts        # 文件夹状态
│   └── settingsStore.ts      # 设置状态
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

### 开源协议

MIT
