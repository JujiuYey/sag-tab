<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  title?: string
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showClose: true,
})

const emit = defineEmits<{
  close: []
}>()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div
        class="absolute inset-0 bg-black/50"
        @click="emit('close')"
      />
      <div
        class="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <div v-if="props.title || showClose" class="mb-4 flex items-center justify-between">
          <h2 v-if="props.title" class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ props.title }}
          </h2>
          <button
            v-if="showClose"
            class="ml-auto rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            @click="emit('close')"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
