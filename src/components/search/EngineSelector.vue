<script setup lang="ts">
import type { SearchEngine } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  modelValue: SearchEngine
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchEngine]
}>()

const engines: { value: SearchEngine; label: string; icon: string }[] = [
  { value: 'google', label: 'Google', icon: 'https://www.google.com/favicon.ico' },
  { value: 'baidu', label: '百度', icon: 'https://www.baidu.com/favicon.ico' },
]

function selectEngine(engine: SearchEngine) {
  emit('update:modelValue', engine)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="flex items-center gap-2">
        <img
          :src="engines.find(e => e.value === modelValue)?.icon"
          :alt="modelValue"
          class="h-4 w-4"
        />
        <ChevronDown class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem
        v-for="engine in engines"
        :key="engine.value"
        class="flex items-center gap-2"
        @click="selectEngine(engine.value)"
      >
        <img :src="engine.icon" :alt="engine.label" class="h-4 w-4" />
        <span>{{ engine.label }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
