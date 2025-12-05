<script setup lang="ts">
import { SelectGroup } from 'radix-vue'

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <SelectGroup>
    <slot />
  </SelectGroup>
</template>
