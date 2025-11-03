import { ref, watch, type Ref } from 'vue'


export function useDebounce<T>(source: Ref<T>, delay = 400) {
const debounced = ref(source.value) as Ref<T>
let t: number | undefined
watch(source, (v) => {
if (t) window.clearTimeout(t)
t = window.setTimeout(() => (debounced.value = v), delay)
})
return debounced
}