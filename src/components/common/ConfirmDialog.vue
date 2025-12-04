<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

interface Props {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
}

withDefaults(defineProps<Props>(), {
  title: '确认',
  confirmText: '确认',
  cancelText: '取消',
  variant: 'danger',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <BaseModal :title="title" @close="emit('cancel')">
    <p class="mb-6 text-gray-600 dark:text-gray-300">{{ message }}</p>
    <div class="flex justify-end gap-3">
      <BaseButton variant="secondary" @click="emit('cancel')">
        {{ cancelText }}
      </BaseButton>
      <BaseButton :variant="variant" @click="emit('confirm')">
        {{ confirmText }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
