<script lang="ts">
import { reactive } from 'vue'

export type Toast = { id: number; text: string; type?: 'success' | 'error' }

const bus = reactive({ list: [] as Toast[] })
let id = 1

export function useToast() {
  function push(text: string, type: Toast['type'] = 'success') {
    const t: Toast = { id: id++, text, type }
    bus.list.push(t)
    setTimeout(() => dismiss(t.id), 2500)
  }
  function dismiss(i: number) {
    bus.list = bus.list.filter(t => t.id !== i)
  }
  return { push, dismiss, bus }
}

export default {
  setup() {
    return { bus }
  },
}
</script>

<template>
  <div
    style="position: fixed; right: 16px; bottom: 16px; display: flex; flex-direction: column; gap: 8px; z-index: 50;"
  >
    <div
      v-for="t in bus.list"
      :key="t.id"
      class="card"
      :style="{
        borderColor: t.type === 'error' ? '#fecaca' : '#bbf7d0',
        background: t.type === 'error' ? '#fef2f2' : '#f0fdf4',
      }"
    >
      {{ t.text }}
    </div>
  </div>
</template>
