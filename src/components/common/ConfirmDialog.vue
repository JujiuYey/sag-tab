<script setup lang="ts">
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

interface Props {
  open: boolean
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
  'update:open': [value: boolean]
}>()

function handleConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <AlertDialog :open="open" @update:open="(v: boolean) => !v && handleCancel()">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ message }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">{{ cancelText }}</AlertDialogCancel>
        <AlertDialogAction
          :class="variant === 'danger' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
