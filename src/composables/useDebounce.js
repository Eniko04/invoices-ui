import { ref, watch } from 'vue';
export function useDebounce(source, delay = 400) {
    const debounced = ref(source.value);
    let t;
    watch(source, (v) => {
        if (t)
            window.clearTimeout(t);
        t = window.setTimeout(() => (debounced.value = v), delay);
    });
    return debounced;
}
