<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { SelectValue, type SelectValueProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectValueProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectValue :class="cn('', props.class)" v-bind="props">
    <slot />
  </SelectValue>
</template>
