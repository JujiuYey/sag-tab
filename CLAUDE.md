# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server with hot reload
pnpm dev

# Type-check and build for production
pnpm build

# Preview production build locally
pnpm preview
```

## Tech Stack

- **Vue 3** with `<script setup>` SFCs and Composition API
- **TypeScript** with strict mode enabled
- **Vite 7** as the build tool
- **pnpm** as the package manager

## Project Structure

- `src/main.ts` - Application entry point, mounts Vue app to `#app`
- `src/App.vue` - Root component
- `src/components/` - Vue single-file components
- `vite.config.ts` - Vite configuration with Vue plugin
- `tsconfig.json` - References split TypeScript configs:
  - `tsconfig.app.json` - App source files (extends @vue/tsconfig)
  - `tsconfig.node.json` - Vite config file

## TypeScript Configuration

Strict TypeScript settings are enforced:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
